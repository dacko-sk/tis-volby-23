import has from 'has';

import { labels } from '../../api/constants';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10({ maxItems = 10 }) {
    const { csvData } = useData();

    // parse data
    const columns = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            columns.push({
                name: getPartyChartLabel(row),
                incoming: row.sum_incoming,
                outgoing: row.sum_outgoing,
            });
        });
    }

    return (
        <TisBarChart
            buttonLink={routes.charts}
            className="mb-4"
            currency
            data={columns.sort(sortBySpending).slice(0, maxItems)}
            disclaimer={
                <span>
                    {labels.charts.disclaimer}
                    <br className="d-xl-none" />
                    {` ${labels.charts.disclaimerClick}`}
                </span>
            }
            title={`Top ${Math.min(
                maxItems,
                columns.length
            )} kampaní podľa výdavkov a príjmov`}
            vertical
        />
    );
}

export default Top10;
