import has from 'has';

import { labels, t } from '../../api/dictionary';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData, { csvAggregatedKeys } from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10({ maxItems = 10 }) {
    const { csvData } = useData();

    // parse data
    const columns = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            columns.push({
                name: getPartyChartLabel(row),
                incoming: row[csvAggregatedKeys.incoming],
                outgoing: row[csvAggregatedKeys.outgoing],
            });
        });
    }

    return (
        <TisBarChart
            buttonLink={routes.charts}
            className="mb-4"
            currency
            data={columns.sort(sortBySpending).slice(0, maxItems)}
            subtitle={`${t(labels.charts.disclaimer)} ${t(
                labels.charts.disclaimerClick
            )}`}
            title={t(labels.charts.top10)}
            vertical
        />
    );
}

export default Top10;
