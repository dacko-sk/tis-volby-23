import { createContext, useContext, useMemo, useState } from 'react';

import { getTimestampFromDate, isNumeric } from '../api/helpers';

export const sheetsId = '1EmyYjnUuhJkqPSolIimi5X91GVeXKTg68XT9BBgQK7E';
export const sheetsConfig = {
    PARTY_ACCOUNTS: {
        name: 'Stranícke účty',
        columns: {
            PARTY: 'Strana',
            FB_ACCOUNTS: 'FB Účty',
            GOOGLE_ACCOUNTS: 'Google účty',
        },
    },
    GOOGLE: {
        name: 'Google reklama',
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
    },
    FB_PRECAMPAIGN: {
        name: 'Predkampaň 11.3.-8.6.',
        columns: {
            ACCOUNTS: 'Účty',
            PAGE_ID: 'Page ID',
            PAGE_NAME: 'Page name',
            SPENDING: 'Amount spent (EUR)',
        },
    },
    FB_WEEKS: {
        columns: {
            PAGE_ID: 'Page ID',
            PAGE_NAME: 'Page name',
            SPENDING: 'Amount spent (EUR)',
        },
    },
};
export const metaApiUrl = 'https://volby.transparency.sk/api/meta/ads_json.php';

const initialState = {
    sheetsData: {
        error: null,
        partiesFb: {},
        partiesGgl: {},
        googleAds: [],
        precampaign: [],
        weeks: {},
        lastUpdate: 0,
    },
    metaApiData: {
        error: null,
        pages: {},
        lastUpdate: 0,
    },
};

const filterPoliticAccounts = (partiesFb) => (pageData) => {
    let isPolitic = false;
    if (pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID] ?? false) {
        Object.values(partiesFb).some((partyAccounts) => {
            if (
                partyAccounts.includes(
                    pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]
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

export const loadingErrorSheets = (error) => {
    return { ...initialState.sheetsData, error };
};

export const processDataSheets = (data) => {
    if (Array.isArray(data)) {
        const pd = { ...initialState.sheetsData };
        data.forEach((sheet) => {
            switch (sheet.id ?? '') {
                case sheetsConfig.PARTY_ACCOUNTS.name: {
                    // first sheet is parties accounts list
                    sheet.data.forEach((row) => {
                        if (
                            row[
                                sheetsConfig.PARTY_ACCOUNTS.columns.FB_ACCOUNTS
                            ] ??
                            false
                        ) {
                            pd.partiesFb[
                                row[sheetsConfig.PARTY_ACCOUNTS.columns.PARTY]
                            ] = row[
                                sheetsConfig.PARTY_ACCOUNTS.columns.FB_ACCOUNTS
                            ]
                                .replaceAll(' ', '')
                                .split(',');
                        }
                        if (
                            row[
                                sheetsConfig.PARTY_ACCOUNTS.columns
                                    .GOOGLE_ACCOUNTS
                            ] ??
                            false
                        ) {
                            pd.partiesGgl[
                                row[sheetsConfig.PARTY_ACCOUNTS.columns.PARTY]
                            ] = row[
                                sheetsConfig.PARTY_ACCOUNTS.columns
                                    .GOOGLE_ACCOUNTS
                            ]
                                .replaceAll(' ', '')
                                .split(',');
                        }
                    });
                    break;
                }
                case sheetsConfig.GOOGLE.name: {
                    // load Google spending from second sheet
                    pd.googleAds = sheet.data;
                    break;
                }
                case sheetsConfig.FB_PRECAMPAIGN.name: {
                    // load precampaing spending from third sheet
                    pd.precampaign = sheet.data.filter(
                        filterPoliticAccounts(pd.partiesFb)
                    );
                    break;
                }
                default: {
                    // load weekly reports from remaining sheets
                    const time = getTimestampFromDate(sheet.id);
                    pd.lastUpdate = time;
                    pd.weeks[time] = sheet.data.filter(
                        filterPoliticAccounts(pd.partiesFb)
                    );
                }
            }
        });
        return pd;
    }
    return data;
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
        // add precampaign data
        sheetsData.precampaign.forEach((pageData) => {
            if (isNumeric(pageData[sheetsConfig.FB_WEEKS.columns.SPENDING])) {
                if (
                    pages[pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]] ??
                    false
                ) {
                    pages[
                        pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]
                    ].outgoing += Number(
                        pageData[sheetsConfig.FB_WEEKS.columns.SPENDING]
                    );
                } else {
                    pages[pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]] = {
                        name: pageData[sheetsConfig.FB_WEEKS.columns.PAGE_NAME],
                        outgoing: Number(
                            pageData[sheetsConfig.FB_WEEKS.columns.SPENDING]
                        ),
                    };
                }
            }
        });
        // add weekly spending from all weeks
        Object.values(sheetsData.weeks).forEach((weekData) => {
            weekData.forEach((pageData) => {
                if (
                    isNumeric(pageData[sheetsConfig.FB_WEEKS.columns.SPENDING])
                ) {
                    if (
                        pages[
                            pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]
                        ] ??
                        false
                    ) {
                        pages[
                            pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]
                        ].outgoing += Number(
                            pageData[sheetsConfig.FB_WEEKS.columns.SPENDING]
                        );
                    } else {
                        pages[pageData[sheetsConfig.FB_WEEKS.columns.PAGE_ID]] =
                            {
                                name: pageData[
                                    sheetsConfig.FB_WEEKS.columns.PAGE_NAME
                                ],
                                outgoing: Number(
                                    pageData[
                                        sheetsConfig.FB_WEEKS.columns.SPENDING
                                    ]
                                ),
                            };
                    }
                }
            });
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
