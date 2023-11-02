import { labels, t } from '../../api/dictionary';
import { dateTimeFormat } from '../../api/helpers';

import useData, { baseDate } from '../../context/DataContext';

function LastUpdateTag({ children, timestamp }) {
    const { csvData } = useData();
    const lastUpdate = timestamp ?? csvData.lastUpdate ?? baseDate;

    return (
        <em className="disclaimer">
            {children && (
                <>
                    {children}
                    <br />
                </>
            )}
            {t(labels.charts.updated)} {dateTimeFormat(lastUpdate)}.
        </em>
    );
}

export default LastUpdateTag;
