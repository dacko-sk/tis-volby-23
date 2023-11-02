import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

import { parties } from '../api/constants';
import { contains } from '../api/helpers';

export const accountsFile =
    'https://raw.githubusercontent.com/matusv/elections-slovakia-2023/main/aggregation_no_returns.csv';
export const baseDate = 1669068712;
export const reloadMinutes = 70;

export const csvAggregatedKeys = {
    account: 'url',
    name: 'name',
};

export const csvAccountKeys = {
    account_name: 'account_name',
    date: 'date',
    amount: 'amount',
    // currency: 'currency',
    message: 'message',
    tx_type: 'tx_type',
    vs: 'vs',
    ss: 'ss',
};

export const types = {
    regional: 'regional',
    local: 'local',
};

export const getFileName = (account) => {
    if (
        !has(account, csvAggregatedKeys.name) ||
        !has(account, csvAggregatedKeys.account)
    ) {
        return null;
    }
    let fileName = null;
    const match = account[csvAggregatedKeys.account].match(
        /.*(?:SK\d{12})?(\d{10}).*/
    );
    if (match && match.length > 1) {
        // #1) IBAN / 10 digits account number match
        [, fileName] = match;
    } else if (account[csvAggregatedKeys.account].length > 9) {
        // #2) last 10 characters
        fileName = account[csvAggregatedKeys.account].substr(-10);
    }
    return fileName
        ? `https://raw.githubusercontent.com/matusv/elections-slovakia-2023/main/accounts/${
              account[csvAggregatedKeys.name]
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
            [csvAggregatedKeys.account, csvAggregatedKeys.name].forEach(
                (column) => {
                    pd.data[index][column] = (row[column] ?? '').trim();
                }
            );

            // fix errors in account numbers
            if (
                contains(
                    pd.data[index][csvAggregatedKeys.account],
                    'transparentneucty.sk/?1/#/'
                )
            ) {
                pd.data[index][csvAggregatedKeys.account] = pd.data[index][
                    csvAggregatedKeys.account
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
                fbName: pd.data[index][csvAggregatedKeys.name],
                fullName: pd.data[index][csvAggregatedKeys.name],
                slug: pd.data[index][csvAggregatedKeys.name],
                share: 0,
            };

            // merge data with party config
            if (has(parties, pd.data[index][csvAggregatedKeys.name])) {
                pd.data[index] = {
                    ...pd.data[index],
                    // overwrite with config
                    ...parties[pd.data[index][csvAggregatedKeys.name]],
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

export const findByProperty = (csvData, property, value) => {
    let party = null;
    if (csvData.data ?? false) {
        csvData.data.some((row) => {
            if (row[property] === value) {
                party = row;
                return true;
            }
            return false;
        });
    }
    return party;
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
    const findPartyByFbName = (fbName) =>
        findByProperty(csvData, 'fbName', fbName);
    const findPartyByWpTags = (tags) => {
        let party = null;
        tags.some((tag) => {
            party = findByProperty(csvData, 'tag', tag);
            if (party) {
                return true;
            }
            return false;
        });
        return party;
    };

    const value = useMemo(
        () => ({
            csvData,
            setCsvData,
            findPartyByFbName,
            findPartyByWpTags,
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
