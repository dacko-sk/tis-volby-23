import { Link } from 'react-router-dom';
import { Sector } from 'recharts';
import has from 'has';

import { colors, labels, parties } from './constants';
import { humanPctFormat, numFormat } from './helpers';
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

export const genders = {
    female: { name: 'Ženy', color: colors.colorOrange },
    male: { name: 'Muži', color: colors.colorDarkBlue },
    unknown: { name: 'Neznáme', color: colors.colorLightBlue },
};

export const getColorOpacityScale = (index, amount) => {
    const [min, max] = [0.5, 1.0];
    return min + (max - min) * Math.min(index / (amount - 1), 1);
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

export const preparePctData = (data, keys) => {
    const sums = keys.map(() => 0);
    const pctData = [];
    data.forEach((dataPoint) => {
        keys.forEach((key, index) => {
            sums[index] += dataPoint[key];
        });
    });
    data.forEach((dataPoint) => {
        const pctKeys = {};
        keys.forEach((key, index) => {
            pctKeys[key] = dataPoint[key] / sums[index];
        });
        pctData.push({
            ...dataPoint,
            ...pctKeys,
        });
    });
    return pctData;
};

export const CustomLabel = (showName, formatPercent) =>
    function ({ cx, cy, midAngle, outerRadius, name, percent, fill }) {
        const RADIAN = Math.PI / 180;

        const radius = outerRadius + 25;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        let label;
        if (showName) {
            label = name;
        } else {
            label = formatPercent
                ? humanPctFormat(percent)
                : numFormat(percent);
        }

        return (
            <text
                x={x}
                y={y}
                fill={fill}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {label}
            </text>
        );
    };

export const CustomTooltip = (dataKeys, dataLabels, formatPercent) =>
    function ({ active, payload }) {
        if (active && payload && payload.length) {
            return (
                <div className="recharts-default-tooltip">
                    <div
                        className="fw-bold"
                        style={{ color: payload[0].payload.color }}
                    >
                        {payload[0].payload.name}
                    </div>
                    {dataKeys.map((key, index) => (
                        <div key={key}>
                            {dataLabels[index]}:{' '}
                            <strong>
                                {formatPercent
                                    ? humanPctFormat(payload[0].payload[key])
                                    : numFormat(payload[0].payload[key])}
                            </strong>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

export function ActiveShape({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
}) {
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={Math.round(innerRadius * 0.95)}
                outerRadius={Math.round(outerRadius * 1.05)}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
}

export function InactiveShape({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
}) {
    return (
        <g>
            <Sector
                className="pie-inactive"
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
}
