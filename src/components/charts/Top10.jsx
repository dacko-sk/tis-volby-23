import has from 'has';

import { labels } from '../../api/constants';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10() {
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
            title={`Top ${Math.min(
                10,
                columns.length
            )} kampaní podľa výdavkov a príjmov`}
            data={columns.sort(sortBySpending).slice(0, 10)}
            disclaimer={
                <span>
                    {labels.charts.disclaimer}
                    <br className="d-xl-none" />
                    {` ${labels.charts.disclaimerClick}`}
                </span>
            }
            buttonLink={routes.charts}
            currency
            vertical
        />
    );
}

export default Top10;
