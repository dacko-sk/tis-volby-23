import has from 'has';

import { labels } from '../../api/constants';
import { dateTimeFormat } from '../../api/helpers';

import useData, { baseDate } from '../../context/DataContext';

function LastUpdateTag({ children, timestamp }) {
    const { csvData } = useData();
    const lastUpdate =
        timestamp ??
        (has(csvData, 'lastUpdate') ? csvData.lastUpdate : baseDate);

    return (
        <em className="disclaimer">
            {children && (
                <>
                    {children}
                    <br />
                </>
            )}
            {labels.charts.updated} {dateTimeFormat(lastUpdate)}.
        </em>
    );
}

export default LastUpdateTag;
