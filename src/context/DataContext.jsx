import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

import { labels, parties } from '../api/constants';
import { compareStr, contains } from '../api/helpers';

export const accountsFile =
    'https://raw.githubusercontent.com/matusv/elections-slovakia-2023/main/aggregation_no_returns.csv';
export const baseDate = 1669068712;
export const reloadMinutes = 70;

export const types = {
    regional: 'regional',
    local: 'local',
};

export const getFileName = (account) => {
    if (
        !has(account, labels.elections.name_key) ||
        !has(account, labels.elections.account_key)
    ) {
        return null;
    }
    let fileName = null;
    const match = account[labels.elections.account_key].match(
        /.*(?:SK\d{12})?(\d{10}).*/
    );
    if (match && match.length > 1) {
        // #1) IBAN / 10 digits account number match
        [, fileName] = match;
    } else if (account[labels.elections.account_key].length > 9) {
        // #2) last 10 characters
        fileName = account[labels.elections.account_key].substr(-10);
    }
    return fileName
        ? `https://raw.githubusercontent.com/matusv/elections-slovakia-2023/main/accounts/${
              account[labels.elections.name_key]
          } ${fileName}.csv`
        : null;
};

export const processAccountsData = (data) => {
    if (has(data, 'data')) {
        const pd = data;
        let lastUpdate = baseDate;
        pd.data.forEach((row, index) => {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);

            // trim certain columns
            [labels.elections.account_key, labels.elections.name_key].forEach(
                (column) => {
                    pd.data[index][column] = (row[column] ?? '').trim();
                }
            );

            // fix errors in account numbers
            if (
                contains(
                    pd.data[index][labels.elections.account_key],
                    'transparentneucty.sk/?1/#/'
                )
            ) {
                pd.data[index][labels.elections.account_key] = pd.data[index][
                    labels.elections.account_key
                ].replace('/?1/#/', '/#/');
            }

            // parse numbers
            pd.data[index].sum_incoming = row.sum_incoming ?? 0;
            pd.data[index].sum_outgoing = Math.abs(row.sum_outgoing ?? 0);
            pd.data[index].balance = row.balance ?? 0;
            pd.data[index].num_incoming = row.num_incoming ?? 0;
            pd.data[index].num_outgoing = row.num_outgoing ?? 0;
            pd.data[index].num_unique_donors = row.num_unique_donors ?? 0;

            // copy full name & slug from account key as default
            pd.data[index] = {
                ...pd.data[index],
                fbName: pd.data[index][labels.elections.name_key],
                fullName: pd.data[index][labels.elections.name_key],
                slug: pd.data[index][labels.elections.name_key],
                share: 0,
            };

            // merge data with party config
            if (has(parties, pd.data[index][labels.elections.name_key])) {
                pd.data[index] = {
                    ...pd.data[index],
                    // overwrite with config
                    ...parties[pd.data[index][labels.elections.name_key]],
                };
            }
        });
        return {
            ...pd,
            lastUpdate,
        };
    }
    return data;
};

export const findRow = (csvData, name, mun) => {
    // parse aggregated data
    let matchedRow = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            if (
                (compareStr(mun, row[labels.elections.municipality_key]) ||
                    compareStr(mun, row.municipalityShortName)) &&
                compareStr(name, row[labels.elections.name_key])
            ) {
                matchedRow = row;
                return true;
            }
            return false;
        });
    }
    return matchedRow;
};

export const buildParserConfig = (processCallback, storeDataCallback) => {
    return {
        worker: true, // must be false for local files
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
            const data = processCallback(results);
            storeDataCallback(data);
        },
    };
};

const initialState = {
    csvData: {
        lastUpdate: baseDate,
    },
};

const DataContext = createContext(initialState);

export const DataProvider = function ({ children }) {
    const [csvData, setCsvData] = useState(initialState.csvData);

    // selectors
    const findInCsvData = (name, mun) => findRow(csvData, name, mun);

    const findPartyByFbName = (fbName) => {
        let party = null;
        if (csvData.data ?? false) {
            csvData.data.some((row) => {
                if (row.fbName === fbName) {
                    party = row;
                    return true;
                }
                return false;
            });
        }
        return party;
    };

    const value = useMemo(
        () => ({
            csvData,
            setCsvData,
            findInCsvData,
            findPartyByFbName,
        }),
        [csvData]
    );

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }

    return context;
};

export default useData;
