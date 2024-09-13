import { dates } from '../../api/constants';
import { labels, t } from '../../api/dictionary';
import { getTimeFromDate } from '../../api/helpers';

import useAdsData from '../../context/AdsDataContext';
import useData, { csvAggregatedKeys } from '../../context/DataContext';

import HeroNumber from '../general/HeroNumber';

function TotalSpending({ finalReport = false }) {
    let total = 0;

    if (finalReport) {
        const { sheetsData } = useAdsData();

        if (sheetsData.loaded) {
            total = [
                ...Object.values(sheetsData.campaign),
                ...Object.values(sheetsData.precampaign),
            ].reduce((sum, amount) => sum + amount, total);
        }

        return (
            <HeroNumber
                disclaimer={t(labels.account.finalReportDisclaimer)}
                lastUpdate={getTimeFromDate(dates.monitoringEnd)}
                loading={!sheetsData.loaded}
                number={total}
                title={t(labels.account.totalSpending)}
            />
        );
    }

    const { csvData } = useData();

    // parse data
    if (csvData.data ?? false) {
        csvData.data.forEach((row) => {
            // sum of outgoing amounts from all transparent accounts
            if (row[csvAggregatedKeys.outgoing] > 0) {
                total += row[csvAggregatedKeys.outgoing];
            }
            // remove manually added duplicate expenses
            if ((row.duplicateExpenses ?? false) && row.duplicateExpenses > 0) {
                total -= row.duplicateExpenses;
            }
        });
    }

    return (
        <HeroNumber
            disclaimer={t(labels.account.totalDisclaimer)}
            lastUpdate={csvData.lastUpdate ?? null}
            loading={!(csvData.data ?? false)}
            number={total}
            title={t(labels.account.totalSpending)}
        />
    );
}

export default TotalSpending;
