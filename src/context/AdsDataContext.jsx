import { createContext, useContext, useMemo, useState } from 'react';

export const googleSheetId = '1E3OiM5lU0D8lXRj_LIs6wR9KxHuEzylYxfF8QYTaFbE';
export const metaApiUrl =
    'https://volby.transparency.sk/api/meta/ads.php?page=all';
export const apiReloadUrl = (accounts) =>
    metaApiUrl + (accounts ? `&reload=${accounts}` : '');

const initialState = {
    sheetsData: {
        error: null,
        parties: {},
        weeks: {},
        lastUpdate: 0,
    },
    metaApiData: {
        error: null,
        pages: {},
        lastUpdate: 0,
    },
};

export const loadingErrorSheets = (error) => {
    return { ...initialState.sheetsData, error };
};

export const processDataSheets = (data) => {
    if (Array.isArray(data)) {
        const pd = { ...initialState.sheetsData };
        data.forEach((sheet, index) => {
            if (index === 0) {
                // first sheet is parties accounts list
                sheet.data.forEach((row) => {
                    pd.parties[row.Strana] = row['Účty']
                        .replaceAll(' ', '')
                        .split(',');
                });
            } else {
                // remaining sheets are weekly reports
                const dateParts = sheet.id
                    .replaceAll('/', '.')
                    .replaceAll(' ', '')
                    .split('.');
                const time =
                    new Date(
                        `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} 23:59:59`
                    ).getTime() / 1000;
                pd.lastUpdate = time;
                // TODO: filter non-political accounts here! .. and remove isPoliticalAccount selector
                pd.weeks[time] = sheet.data;
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
        Object.entries(sheetsData.parties).some(
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

    const isPoliticAccount = (accountId) => {
        let isPolitic = false;
        Object.values(sheetsData.parties).some((partyAccounts) => {
            if (partyAccounts.includes(accountId)) {
                isPolitic = true;
                return true;
            }
            return false;
        });
        return isPolitic;
    };

    const getAllFbAccounts = () => {
        const all = [];
        Object.values(sheetsData.parties).forEach((partyAccounts) => {
            all.push(...partyAccounts);
        });
        return all;
    };

    const getPartyFbAccounts = (fbName) => sheetsData.parties?.[fbName] ?? [];

    const mergedWeeksData = () => {
        const pages = {};
        Object.values(sheetsData.weeks).forEach((weekData) => {
            weekData.forEach((pageData) => {
                if (
                    isPoliticAccount(pageData['Page ID']) &&
                    !Number.isNaN(pageData['Amount spent (EUR)'])
                ) {
                    if (pages[pageData['Page ID']] ?? false) {
                        pages[pageData['Page ID']].outgoing += Number(
                            pageData['Amount spent (EUR)']
                        );
                    } else {
                        pages[pageData['Page ID']] = {
                            name: pageData['Page name'],
                            outgoing: Number(pageData['Amount spent (EUR)']),
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
            isPoliticAccount,
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
