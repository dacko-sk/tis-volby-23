import has from 'has';

import { currencyFormat } from '../../api/helpers';

import useData from '../../context/DataContext';

import LastUpdateTag from './LastUpdateTag';

function TotalSpending() {
    const { csvData } = useData();

    // parse data
    let total = 0;
    if (has(csvData, 'data')) {
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
            <p className="hero-number">
                {currencyFormat(total)}
                <LastUpdateTag
                    timestamp={has(csvData, 'data') ? csvData.lastUpdate : null}
                />
            </p>
        </div>
    );
}

export default TotalSpending;
