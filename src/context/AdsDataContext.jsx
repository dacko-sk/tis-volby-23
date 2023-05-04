import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

export const googleSheetId = '1E3OiM5lU0D8lXRj_LIs6wR9KxHuEzylYxfF8QYTaFbE';

const initialState = {
    adsData: {
        pages: {},
        weeks: {},
        lastUpdate: 0,
    },
    setAdsData: () => {},
};

export const processSheetData = (data) => {
    if (Array.isArray(data)) {
        const ads = { ...initialState.adsData };
        data.forEach((sheet, index) => {
            if (index === 0) {
                // first sheet is parties accounts list
                sheet.data.forEach((row) => {
                    ads.pages[row.Strana] = row['Účty']
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
                ads.lastUpdate = time;
                ads.weeks[time] = sheet.data;
            }
        });
        return ads;
    }
    return data;
};

export const getPartyFbAccounts = (fbName, adsData) => {
    return has(adsData.pages[fbName]) ? adsData.pages[fbName] : [];
};

export const findPartyForFbAccount = (accountId, adsData, csvData) => {
    if (has(csvData, 'data')) {
        let fbName = null;
        Object.entries(adsData.pages).some(([partyFbName, partyAccounts]) => {
            if (partyAccounts.includes(accountId)) {
                fbName = partyFbName;
                return true;
            }
            return false;
        });
        if (fbName) {
            let party = null;
            csvData.data.some((row) => {
                if (row.fbName === fbName) {
                    party = row;
                    return true;
                }
                return false;
            });
            return party;
        }
    }
    return null;
};

const AdsDataContext = createContext(initialState);

export const AdsDataProvider = function ({ children }) {
    const [adsData, setAdsData] = useState(initialState.adsData);

    const value = useMemo(
        () => ({
            adsData,
            setAdsData,
        }),
        [adsData]
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
