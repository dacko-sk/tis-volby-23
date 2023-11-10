import { Link } from 'react-router-dom';
import { Sector } from 'recharts';

import { colors, parties } from './constants';
import { shortenValue } from './helpers';
import { routes, separators } from './routes';
import { csvConfig, csvFiles } from '../context/AdsDataContext';
import { csvAggregatedKeys } from '../context/DataContext';

export const isMobile = window.innerWidth < 576;
export const horizontalYaxisWidth = 80;
export const verticalYaxisWidth = isMobile ? 120 : 180;

export const regionKeys = {
    BA: 'BA',
    BB: 'BB',
    KE: 'KE',
    NR: 'NR',
    PO: 'PO',
    TN: 'TN',
    TT: 'TT',
    ZA: 'ZA',
};
export const regionOptions = {
    [regionKeys.BA]: {
        size: 677024,
        color: colors.colorLightBlue,
    },
    [regionKeys.BB]: {
        size: 643102,
        color: colors.colorOrange,
    },
    [regionKeys.KE]: { size: 802092, color: '#c19c00' },
    [regionKeys.NR]: { size: 671508, color: '#75066e' },
    [regionKeys.PO]: { size: 827028, color: '#cd2b26' },
    [regionKeys.TN]: { size: 582567, color: colors.colorDarkBlue },
    [regionKeys.TT]: { size: 565324, color: '#1f1a17' },
    [regionKeys.ZA]: { size: 691136, color: '#18943c' },
};

export const genderKeys = {
    female: 'female',
    male: 'male',
    unknown: 'unknown',
};
export const genderColors = {
    [genderKeys.female]: colors.colorOrange,
    [genderKeys.male]: colors.colorDarkBlue,
    [genderKeys.unknown]: colors.colorGrey,
};

export const attributionKeys = {
    YES: 'YES',
    NO: 'NO',
    'N/A': 'N/A',
};
export const attributionColors = {
    [attributionKeys.YES]: colors.colorDarkBlue,
    [attributionKeys.NO]: colors.colorOrange,
    [attributionKeys['N/A']]: colors.colorGrey,
};

export const ageColors = {
    '13-17': '#1f1a17',
    '18-24': '#c19c00',
    '25-34': '#18943c',
    '35-44': colors.colorLightBlue,
    '45-54': colors.colorDarkBlue,
    '55-64': '#75066e',
    '65+': colors.colorOrange,
};

const googleColumns = csvConfig[csvFiles.GOOGLE].columns;
export const formatDefs = {
    [googleColumns.VIDEO]: colors.colorOrange,
    [googleColumns.IMAGE]: colors.colorDarkBlue,
    [googleColumns.TEXT]: colors.colorLightBlue,
};

export const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    return <strong>{parts.length ? parts[0] : value}</strong>;
};

export const tickLabel = (value) => {
    const parts = value.split(separators.newline);
    return parts.length > 1 ? (
        <Link to={routes.party(parts[0], parts[1])}>{parts[0]}</Link>
    ) : (
        value
    );
};

export const getPartyChartLabel = (row, subpage) => {
    const n =
        parties[row[csvAggregatedKeys.name]]?.slug ??
        row[csvAggregatedKeys.name];
    return n + separators.newline + (subpage ?? '');
};

export const shortChartNames = (name) => shortenValue(name, isMobile ? 30 : 60);

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

export const prepareAvgDeltaPctData = (data, keys) => {
    const sums = keys.map(() => 0);
    const avgs = [];
    const pctData = [];
    data.forEach((dataPoint) => {
        keys.forEach((key, index) => {
            sums[index] += dataPoint[key];
        });
    });
    sums.forEach((sum, index) => {
        avgs[index] = sum / data.length;
    });
    data.forEach((dataPoint) => {
        const pctKeys = {};
        keys.forEach((key, index) => {
            pctKeys[key] = dataPoint[key] / avgs[index] - 1;
        });
        pctData.push({
            ...dataPoint,
            ...pctKeys,
        });
    });
    return pctData;
};

export const CustomLabel = (showName, formatPercent, formatter) =>
    function ({ cx, cy, fill, midAngle, outerRadius, name, percent, value }) {
        const RADIAN = Math.PI / 180;

        const radius = outerRadius + 25;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        let label;
        if (showName) {
            label = name;
        } else {
            label = formatter(formatPercent ? percent : value);
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

export const CustomTooltip = (dataKeys, dataLabels, formatter) =>
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
                                {formatter(payload[0].payload[key])}
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
