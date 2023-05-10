import has from 'has';

import { labels } from '../../api/constants';
import { currencyFormat } from '../../api/helpers';

import useData from '../../context/DataContext';

import LastUpdateTag from '../general/LastUpdateTag';
import Loading from '../general/Loading';

function TotalSpending() {
    const { csvData } = useData();

    // parse data
    let total = 0;
    if (csvData.data ?? false) {
        csvData.data.forEach((row) => {
            // sum of outgoing amounts from all transparent accounts
            if (row.sum_outgoing > 0) {
                total += row.sum_outgoing;
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
            <div className="hero-number">
                {csvData.data ?? false ? (
                    currencyFormat(total)
                ) : (
                    <Loading small />
                )}
                <LastUpdateTag
                    timestamp={has(csvData, 'data') ? csvData.lastUpdate : null}
                >
                    {labels.account.totalDisclaimer}
                </LastUpdateTag>
            </div>
        </div>
    );
}

export default TotalSpending;
