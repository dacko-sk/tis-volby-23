import { Link } from 'react-router-dom';
import has from 'has';

import { colors, labels, parties } from './constants';
import { routes, separators } from './routes';

export const regions = {
    BA: {
        name: 'Bratislavský kraj',
        size: 677024,
        color: colors.colorLightBlue,
    },
    BB: {
        name: 'Banskobystrický kraj',
        size: 643102,
        color: colors.colorOrange,
    },
    KE: { name: 'Košický kraj', size: 802092, color: '#c19c00' },
    NR: { name: 'Nitriansky kraj', size: 671508, color: '#75066e' },
    PO: { name: 'Prešovský kraj', size: 827028, color: '#cd2b26' },
    TN: { name: 'Trenčiansky kraj', size: 582567, color: colors.colorDarkBlue },
    TT: { name: 'Trnavský kraj', size: 565324, color: '#1f1a17' },
    ZA: { name: 'Žilinský kraj', size: 691136, color: '#18943c' },
    W: { name: 'Zahraničie', color: '#004549' },
};

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
