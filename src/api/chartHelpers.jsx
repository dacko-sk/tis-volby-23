import { Link } from 'react-router-dom';
import has from 'has';

import { labels, parties } from './constants';
import { routes, separators } from './routes';

export const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    return <strong>{parts.length ? parts[0] : value}</strong>;
};

export const tickLabel = (value) => {
    const parts = value.split(separators.newline);
    return parts.length > 1 ? (
        <Link to={routes.party(parts[0])}>{parts[0]}</Link>
    ) : (
        value
    );
};

export const getPartyChartLabel = (row) => {
    const n =
        has(parties, row[labels.elections.name_key]) &&
        has(parties[row[labels.elections.name_key]], 'slug')
            ? parties[row[labels.elections.name_key]].slug
            : row[labels.elections.name_key];
    return n + separators.newline;
};

export const preparePctData = (data, key) => {
    const pctData = [];
    let sum = 0;
    data.forEach((dataPoint) => {
        sum += dataPoint[key];
    });
    data.forEach((dataPoint) => {
        pctData.push({
            ...dataPoint,
            [key]: dataPoint[key] / sum,
        });
    });
    return pctData;
};
