import has from 'has';

import { labels } from '../../api/constants';
import { sortBySpending } from '../../api/helpers';
import { routes, separators } from '../../api/routes';

import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10() {
    const { csvData } = useData();

    // parse data
    const parties = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            parties.push({
                name: `${row[labels.elections.name_key] + separators.newline}`,
                incoming: row.sum_incoming,
                outgoing: row.sum_outgoing,
            });
        });
    }

    return (
        <TisBarChart
            title={`Top ${Math.min(
                10,
                parties.length
            )} kampaní podľa výdavkov a príjmov`}
            data={parties.sort(sortBySpending).slice(0, 10)}
            buttonLink={routes.charts}
            currency
            vertical
        />
    );
}

export default Top10;
