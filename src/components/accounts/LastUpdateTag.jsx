import has from 'has';

import { labels } from '../../api/constants';
import { dateTimeFormat } from '../../api/helpers';

import useData, { baseDate } from '../../context/DataContext';

function LastUpdateTag({ short, timestamp }) {
    const { csvData } = useData();
    const lastUpdate =
        timestamp ??
        (has(csvData, 'lastUpdate') ? csvData.lastUpdate : baseDate);

    return (
        <em className="disclaimer">
            {!short && (
                <span>
                    {labels.charts.disclaimer}
                    <br className="d-xl-none" />
                    {` ${labels.charts.disclaimerClick}`}
                </span>
            )}
            <br />
            {labels.charts.updated} {dateTimeFormat(lastUpdate)}.
        </em>
    );
}

export default LastUpdateTag;
