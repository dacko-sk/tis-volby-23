import { createContext, useContext, useMemo, useState } from 'react';

import { getTimestampFromDate, isNumeric } from '../api/helpers';

import accounts from '../../public/csv/online/accounts.csv';
import google from '../../public/csv/online/Google.csv';
import meta from '../../public/csv/online/Meta.csv';

export const csvFiles = {
    PARTY_ACCOUNTS: 'PARTY_ACCOUNTS',
    GOOGLE: 'GOOGLE',
    META: 'META',
};

export const csvConfig = {
    [csvFiles.PARTY_ACCOUNTS]: {
        columns: {
            PARTY: 'Strana',
            FB_ACCOUNTS: 'FB Účty',
            GOOGLE_ACCOUNTS: 'Google účty',
            CL: 'Kandidátne listiny',
            ASSETS: 'Majetkové priznania',
            REPORT: 'Záverečné správy',
        },
        file: accounts,
    },
    [csvFiles.GOOGLE]: {
        columns: {
            ID: 'ID',
            PAGE_NAME: 'Inzerent',
            SPENDING: 'Výdavky na reklamu',
            AMOUNT: 'Počet reklám',
            VIDEO: 'Video',
            IMAGE: 'Obrázková',
            TEXT: 'Textová',
            UPDATED: 'Aktualizácia',
        },
        file: google,
    },
    [csvFiles.META]: {
        columns: {
            PAGE_ID: 'Page ID',
            PAGE_NAME: 'Page name',
            SPENDING: 'Amount spent (EUR)',
        },
        endDate: '27.9.2023',
        file: meta,
    },
};

export const metaApiUrl = 'https://volby.transparency.sk/api/meta/ads_json.php';

const initialState = {
    sheetsData: {
        error: null,
        partiesFb: {},
        partiesGgl: {},
        googleAds: [],
        metaAds: [],
        lastUpdateFb: 0,
        lastUpdateGgl: 0,
        candidatesLists: {},
        assets: {},
        reports: {},
    },
    metaApiData: {
        error: null,
        pages: {},
        lastUpdate: 0,
    },
};

const filterPoliticAccounts = (partiesFb) => (pageData) => {
    let isPolitic = false;
    if (pageData[csvConfig[csvFiles.META].columns.PAGE_ID] ?? false) {
        Object.values(partiesFb).some((partyAccounts) => {
            if (
                partyAccounts.includes(
                    pageData[csvConfig[csvFiles.META].columns.PAGE_ID]
                )
            ) {
                isPolitic = true;
                return true;
            }
            return false;
        });
    }
    return isPolitic;
};

export const loadingErrorCsv = (error) => {
    return { ...initialState.sheetsData, error };
};

export const processCsvFiles = (allData) => {
    const pd = { ...initialState.sheetsData };
    Object.keys(csvFiles).forEach((key) => {
        if (Array.isArray(allData[key].data)) {
            switch (key) {
                case csvFiles.PARTY_ACCOUNTS: {
                    allData[key].data.forEach((row) => {
                        if (row[csvConfig[key].columns.FB_ACCOUNTS] ?? false) {
                            pd.partiesFb[row[csvConfig[key].columns.PARTY]] =
                                row[csvConfig[key].columns.FB_ACCOUNTS]
                                    .replaceAll(' ', '')
                                    .split(',');
                        }
                        if (
                            row[csvConfig[key].columns.GOOGLE_ACCOUNTS] ??
                            false
                        ) {
                            pd.partiesGgl[row[csvConfig[key].columns.PARTY]] =
                                row[csvConfig[key].columns.GOOGLE_ACCOUNTS]
                                    .replaceAll(' ', '')
                                    .split(',');
                        }
                        if (row[csvConfig[key].columns.CL] ?? false) {
                            pd.candidatesLists[
                                row[csvConfig[key].columns.PARTY]
                            ] = row[csvConfig[key].columns.CL];
                        }
                        if (row[csvConfig[key].columns.ASSETS] ?? false) {
                            pd.assets[row[csvConfig[key].columns.PARTY]] =
                                row[csvConfig[key].columns.ASSETS];
                        }
                        if (row[csvConfig[key].columns.REPORT] ?? false) {
                            pd.reports[row[csvConfig[key].columns.PARTY]] =
                                row[csvConfig[key].columns.REPORT];
                        }
                    });
                    break;
                }
                case csvFiles.GOOGLE: {
                    pd.googleAds = allData[key].data;
                    allData[key].data.forEach((pageData) => {
                        const time = getTimestampFromDate(
                            pageData[csvConfig[key].columns.UPDATED]
                        );
                        if (time > pd.lastUpdateGgl) {
                            pd.lastUpdateGgl = time;
                        }
                    });
                    break;
                }
                case csvFiles.META:
                default: {
                    pd.metaAds = allData[key].data.filter(
                        filterPoliticAccounts(pd.partiesFb)
                    );
                    pd.lastUpdateFb = getTimestampFromDate(
                        csvConfig[key].endDate
                    );
                }
            }
        }
    });
    return pd;
};

export const loadingErrorMetaApi = (error, originalData) => {
    return { ...originalData, error };
};

export const processDataMetaApi = (data) => {
    if (data.pages ?? false) {
        const pd = { ...initialState.metaApiData, ...data };
        Object.values(data.pages).forEach((pageData) => {
            pd.lastUpdate = Math.max(pd.lastUpdate, pageData.updated ?? 0);
        });
        return pd;
    }
    return data;
};

const AdsDataContext = createContext(initialState);

export const AdsDataProvider = function ({ children }) {
    const [sheetsData, setSheetsData] = useState(initialState.sheetsData);
    const [metaApiData, setMetaApiData] = useState(initialState.metaApiData);

    // selectors

    const findPartyForFbAccount = (accountId) => {
        let fbName = null;
        Object.entries(sheetsData.partiesFb).some(
            ([partyFbName, partyAccounts]) => {
                if (partyAccounts.includes(accountId)) {
                    fbName = partyFbName;
                    return true;
                }
                return false;
            }
        );
        return fbName;
    };

    const findPartyForGoogleAccount = (accountId) => {
        let fbName = null;
        Object.entries(sheetsData.partiesGgl).some(
            ([partyFbName, partyAccounts]) => {
                if (partyAccounts.includes(accountId)) {
                    fbName = partyFbName;
                    return true;
                }
                return false;
            }
        );
        return fbName;
    };

    const getAllFbAccounts = () => {
        const all = [];
        Object.values(sheetsData.partiesFb).forEach((partyAccounts) => {
            all.push(...partyAccounts);
        });
        return all;
    };

    const getPartyFbAccounts = (fbName) => sheetsData.partiesFb?.[fbName] ?? [];

    const mergedWeeksData = () => {
        const pages = {};
        // add weekly spending from all weeks
        sheetsData.metaAds.forEach((pageData) => {
            if (
                isNumeric(pageData[csvConfig[csvFiles.META].columns.SPENDING])
            ) {
                if (
                    pages[pageData[csvConfig[csvFiles.META].columns.PAGE_ID]] ??
                    false
                ) {
                    pages[
                        pageData[csvConfig[csvFiles.META].columns.PAGE_ID]
                    ].outgoing += Number(
                        pageData[csvConfig[csvFiles.META].columns.SPENDING]
                    );
                } else {
                    pages[pageData[csvConfig[csvFiles.META].columns.PAGE_ID]] =
                        {
                            name: pageData[
                                csvConfig[csvFiles.META].columns.PAGE_NAME
                            ],
                            outgoing: Number(
                                pageData[
                                    csvConfig[csvFiles.META].columns.SPENDING
                                ]
                            ),
                        };
                }
            }
        });

        return pages;
    };

    const value = useMemo(
        () => ({
            sheetsData,
            setSheetsData,
            metaApiData,
            setMetaApiData,
            findPartyForFbAccount,
            findPartyForGoogleAccount,
            getAllFbAccounts,
            getPartyFbAccounts,
            mergedWeeksData: mergedWeeksData(),
        }),
        [sheetsData, metaApiData]
    );

    return (
        <AdsDataContext.Provider value={value}>
            {children}
        </AdsDataContext.Provider>
    );
};

const useAdsData = () => {
    const context = useContext(AdsDataContext);

    if (context === undefined) {
        throw new Error('useAdsData must be used within an AdsDataContext');
    }

    return context;
};

export default useAdsData;
