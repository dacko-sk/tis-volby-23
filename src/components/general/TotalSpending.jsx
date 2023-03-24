import has from 'has';

import { labels } from '../../api/constants';
import { currencyFormat } from '../../api/helpers';

import useData from '../../context/DataContext';

import LastUpdateTag from './LastUpdateTag';

function TotalSpending() {
    const { csvData } = useData();

    // parse data
    let total = 0;
    const uniqueAccounts = {};
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            // sum of outgoing amounts from all transparent accounts
            if (row.sum_outgoing > 0) {
                // add each account number only once
                if (has(uniqueAccounts, row[labels.elections.account_key])) {
                    uniqueAccounts[row[labels.elections.account_key]] += 1;
                } else {
                    uniqueAccounts[row[labels.elections.account_key]] = 1;
                    total += row.sum_outgoing;
                }
            }
            // remove manually added duplicate expenses
            if (has(row, 'duplicateExpenses') && row.duplicateExpenses > 0) {
                total -= row.duplicateExpenses;
            }
        });
    }

    return (
        <div className="total-spending">
            <h2>Celkové výdavky strán</h2>
            <p className="hero-number">
                {currencyFormat(total)}
                <LastUpdateTag
                    short
                    timestamp={has(csvData, 'data') ? csvData.lastUpdate : null}
                />
            </p>
        </div>
    );
}

export default TotalSpending;
