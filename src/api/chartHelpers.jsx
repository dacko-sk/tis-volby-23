import { Link } from 'react-router-dom';
import { Sector } from 'recharts';

import { parties } from './constants';
import { labels, t } from './dictionary';
import { isNumeric, shortenValue } from './helpers';
import { routes, separators } from './routes';

import { csvAggregatedKeys } from '../context/DataContext';

const tooltipSeparator = ' : ';

export const isMobile = window.innerWidth < 576;
export const horizontalYaxisWidth = 80;
export const verticalYaxisWidth = isMobile ? 120 : 180;

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

export const BarsTooltip = (bars, showSum, valueFormatter) =>
    function ({ active, payload }) {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            let sum = 0;
            return (
                <div className="recharts-default-tooltip">
                    <p className="recharts-tooltip-label fw-bold">
                        {tooltipNameFormat(t(dataPoint.name))}
                    </p>
                    <ul className="recharts-tooltip-item-list">
                        {bars
                            .filter((bar) =>
                                isNumeric(dataPoint[bar.key] ?? NaN)
                            )
                            .map((bar) => {
                                sum += dataPoint[bar.key];
                                return (
                                    <li
                                        key={bar.key}
                                        className="recharts-tooltip-item"
                                        style={{ color: bar.color }}
                                    >
                                        <span className="recharts-tooltip-item-name">
                                            {t(bar.longName ?? bar.name)}
                                        </span>
                                        <span className="recharts-tooltip-item-separator">
                                            {tooltipSeparator}
                                        </span>
                                        <span className="recharts-tooltip-item-value fw-bold">
                                            {valueFormatter(dataPoint[bar.key])}
                                        </span>
                                    </li>
                                );
                            })}
                        {showSum && bars.length > 1 && (
                            <li
                                key="sum"
                                className="recharts-tooltip-item fw-bold"
                            >
                                <span className="recharts-tooltip-item-name">
                                    {t(labels.charts.sum)}
                                </span>
                                <span className="recharts-tooltip-item-separator">
                                    {tooltipSeparator}
                                </span>
                                <span className="recharts-tooltip-item-value">
                                    {valueFormatter(sum)}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            );
        }

        return null;
    };

export const PieTooltip = (dataKeys, dataLabels, formatter) =>
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
