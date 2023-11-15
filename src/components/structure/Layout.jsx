import { useEffect } from 'react';
import { usePapaParse } from 'react-papaparse';
import { Outlet, useLocation } from 'react-router-dom';
import has from 'has';
import { useQuery } from '@tanstack/react-query';

import { scrollToTop } from '../../api/browserHelpers';

import useAdsData, {
    csvConfig,
    loadingErrorCsv,
    loadingErrorMetaApi,
    metaApiUrl,
    processDataMetaApi,
    processCsvFiles,
} from '../../context/AdsDataContext';
import useData, {
    accountsFile,
    baseDate,
    buildParserConfig,
    processAccountsData,
    reloadMinutes,
} from '../../context/DataContext';

import Header from './Header';
import Footer from './Footer';
import DonateBanner from '../general/DonateBanner';
import DonateModal from '../general/DonateModal';

function Layout() {
    const { metaApiData, setSheetsData, setMetaApiData } = useAdsData();
    const { csvData, setCsvData } = useData();
    const lastUpdate = has(csvData, 'lastUpdate')
        ? csvData.lastUpdate
        : baseDate;
    const currentTime = new Date().getTime();
    const outdatedMinutes = (currentTime / 1000 - lastUpdate) / 60;
    const reloadData = outdatedMinutes > reloadMinutes;
    const { readRemoteFile } = usePapaParse();
    const { pathname } = useLocation();

    // load election data from CSV API and store in context provider
    useEffect(() => {
        let timer = null;
        const accountsConfig = buildParserConfig(
            processAccountsData,
            setCsvData
        );
        if (reloadData) {
            readRemoteFile(`${accountsFile}?t=${currentTime}`, accountsConfig);
        } else {
            // file is loaded and does not need reloading yet (we know the real last update time) - set timeout
            const minutes = reloadMinutes - outdatedMinutes;
            console.log(`CSV data will be reloaded in ${minutes} minutes`);
            timer = setTimeout(
                () => {
                    readRemoteFile(
                        `${accountsFile}?t=${currentTime}`,
                        accountsConfig
                    );
                },
                minutes * 60 * 1000
            );
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [reloadData]);

    // load ads data from google sheet
    useEffect(() => {
        const csvFiles = Object.entries(csvConfig);
        const filesData = {};
        Promise.all(
            csvFiles.map(
                ([key, config]) =>
                    new Promise((resolve, reject) => {
                        readRemoteFile(config.file, {
                            worker: false,
                            header: true,
                            dynamicTyping: false, // do not resolve types
                            skipEmptyLines: true,
                            complete: (csv) => {
                                filesData[key] = csv;
                                return resolve(key);
                            },
                            error: reject,
                        });
                    })
            )
        )
            .then((results) => {
                const pd =
                    results.length === csvFiles.length
                        ? processCsvFiles(filesData)
                        : loadingErrorCsv('Failed to load all files');
                setSheetsData(pd);
            })
            .catch((error) => {
                const pd = loadingErrorCsv(error);
                setSheetsData(pd);
            });
    }, []);

    // load ads data from meta API & reload every 12 hours
    const d = new Date();
    const reloadKey = `${d.getMonth() + 1}${d.getDate()}${Math.floor(
        d.getHours() / 12
    )}`;
    const {
        isLoading: maLoading,
        error: maError,
        data: maData,
    } = useQuery([`meta_api_all_${reloadKey}`], () =>
        fetch(`${metaApiUrl}?${reloadKey}`).then((response) => response.json())
    );
    // store meta API data in context provider once loaded
    useEffect(() => {
        if (maError) {
            const parsed = loadingErrorMetaApi(maError, metaApiData);
            setMetaApiData(parsed);
        } else if (!maLoading && maData) {
            const parsed = processDataMetaApi(maData);
            if (parsed.lastUpdate > metaApiData.lastUpdate) {
                setMetaApiData(parsed);
            }
        }
    }, [maData, maLoading, maError]);

    // send pageview to analytics on route change
    useEffect(() => {
        if (!window.location.href.includes('localhost')) {
            window.dataLayer.push({
                event: 'pageview',
                page: {
                    path: pathname,
                    title: document.title,
                },
            });
        }
    }, [pathname]);

    // scroll to top when route changes
    useEffect(() => {
        scrollToTop();
    }, [pathname]);

    return (
        <div className="layout-default">
            <Header />

            <main className="container mb-4">
                <Outlet />
            </main>

            <DonateBanner />

            <Footer />

            <DonateModal />
        </div>
    );
}

export default Layout;
