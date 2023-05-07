import { createContext, useContext, useMemo, useState } from 'react';

export const googleSheetId = '1E3OiM5lU0D8lXRj_LIs6wR9KxHuEzylYxfF8QYTaFbE';
export const metaApiUrl =
    'https://volby.transparency.sk/api/meta/ads_archive.php?page=all';
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
                const time = new Date(
                    `${dateParts[2]} ${dateParts[1]} ${dateParts[0]}`
                ).getTime();
                pd.lastUpdate = time;
                pd.weeks[time] = sheet.data;
            }
        });
        return pd;
    }
    return data;
};

export const loadingErrorMetaApi = (error) => {
    return { ...initialState.metaApiData, error };
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
    const findPartyForFbAccount = (accountId, csvData) => {
        let fbName = null;
        let party = null;
        if (csvData.data ?? false) {
            Object.entries(sheetsData.parties).some(
                ([partyFbName, partyAccounts]) => {
                    if (partyAccounts.includes(accountId)) {
                        fbName = partyFbName;
                        return true;
                    }
                    return false;
                }
            );
            if (fbName) {
                csvData.data.some((row) => {
                    if (row.fbName === fbName) {
                        party = row;
                        return true;
                    }
                    return false;
                });
            }
        }
        return [fbName, party];
    };

    const getAllFbAccounts = () => {
        const all = [];
        Object.values(sheetsData.parties).forEach((partyAccounts) => {
            all.push(...partyAccounts);
        });
        return all;
    };

    const getPartyFbAccounts = (fbName) => sheetsData.parties?.[fbName] ?? [];

    const value = useMemo(
        () => ({
            sheetsData,
            setSheetsData,
            metaApiData,
            setMetaApiData,
            findPartyForFbAccount,
            getAllFbAccounts,
            getPartyFbAccounts,
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
