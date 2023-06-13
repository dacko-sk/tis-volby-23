import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import { getPartyChartLabel } from '../api/chartHelpers';
import { labels } from '../api/constants';
import { setTitle, sortByNumericProp, sortBySpending } from '../api/helpers';

import useAdsData from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import AlertWithIcon from '../components/general/AlertWithIcon';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

const chartKeys = {
    SPENDING_PARTIES: labels.ads.spendingPartiesTitle,
    SPENDING_ACCOUNTS: labels.ads.spendingAccountsTitle,
    RANGES_PARTIES: labels.ads.rangesPartiesTitle,
    RANGES_ACCOUNTS: labels.ads.rangesAccountsTitle,
    AMOUNTS_PARTIES: labels.ads.amountPartiesTitle,
    AMOUNTS_ACCOUNTS: labels.ads.amountAccountsTitle,
};

const pageTitle = 'Online kampane';

function Online() {
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING_PARTIES]);
    const [loadedCharts, setLoadedCharts] = useState([
        chartKeys.SPENDING_PARTIES,
    ]);

    const { metaApiData, sheetsData, mergedWeeksData, findPartyForFbAccount } =
        useAdsData();
    const { findPartyByFbName } = useCsvData();

    // parse data from sheets
    let spending = [];
    const spendingAggr = {};
    if (sheetsData.lastUpdate) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const fbName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(fbName);
            if (fbName) {
                if (spendingAggr[fbName] ?? false) {
                    spendingAggr[fbName].outgoing += pageProps.outgoing;
                } else {
                    spendingAggr[fbName] = {
                        name: party ? getPartyChartLabel(party) : fbName,
                        outgoing: pageProps.outgoing,
                    };
                }
            }
        });
        if (loadedCharts.includes(chartKeys.SPENDING_ACCOUNTS)) {
            spending = Object.values(mergedWeeksData);
        }
    }

    // parse data from API
    const pages = [];
    const partiesAggr = {};
    const amounts = [];
    const amountsAggr = {};
    let timestamp = 0;
    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const fbName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(fbName);
            if (fbName) {
                if (loadedCharts.includes(chartKeys.RANGES_PARTIES)) {
                    if (partiesAggr[fbName] ?? false) {
                        partiesAggr[fbName].range[0] += pageProps.spend.min;
                        partiesAggr[fbName].range[1] += pageProps.spend.max;
                        partiesAggr[fbName].est += pageProps.spend.est;
                    } else {
                        partiesAggr[fbName] = {
                            name: party ? getPartyChartLabel(party) : fbName,
                            range: [pageProps.spend.min, pageProps.spend.max],
                            est: pageProps.spend.est,
                        };
                    }
                }
                if (loadedCharts.includes(chartKeys.AMOUNTS_PARTIES)) {
                    if (amountsAggr[fbName] ?? false) {
                        amountsAggr[fbName].num += pageProps.spend.num;
                    } else {
                        amountsAggr[fbName] = {
                            name: party ? getPartyChartLabel(party) : fbName,
                            num: pageProps.spend.num,
                        };
                    }
                }
            }
            if (loadedCharts.includes(chartKeys.RANGES_ACCOUNTS)) {
                pages.push({
                    id: pageId,
                    name: pageProps.name,
                    range: [pageProps.spend.min, pageProps.spend.max],
                    est: pageProps.spend.est,
                });
            }
            if (loadedCharts.includes(chartKeys.AMOUNTS_ACCOUNTS)) {
                amounts.push({
                    id: pageId,
                    name: pageProps.name,
                    num: pageProps.spend.num,
                });
            }
            timestamp = Math.max(timestamp, pageProps.updated);
        });
    }

    const charts = {
        [chartKeys.SPENDING_PARTIES]: loadedCharts.includes(
            chartKeys.SPENDING_PARTIES
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={Object.values(spendingAggr).sort(sortBySpending)}
                timestamp={sheetsData.lastUpdate}
                subtitle={labels.ads.spendingPartiesDisclaimer}
                vertical
            />
        ) : null,
        [chartKeys.SPENDING_ACCOUNTS]: loadedCharts.includes(
            chartKeys.SPENDING_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={spending.sort(sortBySpending)}
                timestamp={sheetsData.lastUpdate}
                subtitle={labels.ads.spendingDisclaimer}
                vertical
            />
        ) : null,
        [chartKeys.RANGES_PARTIES]: (
            <FbRangesChart
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                timestamp={timestamp}
                subtitle={labels.ads.rangesDisclaimer}
                vertical
            />
        ),
        [chartKeys.RANGES_ACCOUNTS]: loadedCharts.includes(
            chartKeys.RANGES_ACCOUNTS
        ) ? (
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                timestamp={timestamp}
                subtitle={labels.ads.rangesDisclaimer}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_PARTIES]: loadedCharts.includes(
            chartKeys.AMOUNTS_PARTIES
        ) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={Object.values(amountsAggr).sort(sortByNumericProp('num'))}
                timestamp={timestamp}
                subtitle={labels.ads.amountDisclaimer}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_ACCOUNTS]: loadedCharts.includes(
            chartKeys.AMOUNTS_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                timestamp={timestamp}
                subtitle={labels.ads.amountDisclaimer}
                vertical
            />
        ) : null,
    };

    const accordions = [];
    Object.values(chartKeys).forEach((chartKey) => {
        accordions.push(
            <Accordion.Item key={chartKey} eventKey={chartKey}>
                <Accordion.Header>{chartKey}</Accordion.Header>
                <Accordion.Body>{charts[chartKey]}</Accordion.Body>
            </Accordion.Item>
        );
    });

    if (!metaApiData.lastUpdate || metaApiData.error) {
        // waiting for data or error in loding
        return <Loading error={metaApiData.error} />;
    }

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKeys(ak);
        // remember if chart was already loaded
        ak.forEach((key) => {
            if (!loadedCharts.includes(key)) {
                setLoadedCharts([...loadedCharts, ...[key]]);
            }
        });
    };

    setTitle(pageTitle);

    return (
        <section className="charts-page">
            <Title>{pageTitle}</Title>

            <AlertWithIcon className="my-4" variant="primary">
                Politickú reklamu strán a ich politikov na sociálnej sieti
                Facebook sledujeme vďaka údajom, ktoré publikuje spoločnosť META
                v knižnici Ad Facebook Library.
                <br />
                Sumy sú uvedené bez DPH.
            </AlertWithIcon>
            <Accordion
                className="mt-4"
                activeKey={activeKeys}
                alwaysOpen
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </section>
    );
}

export default Online;
