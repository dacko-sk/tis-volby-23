import { useState } from 'react';
import {
    ResponsiveContainer,
    Cell,
    Legend,
    Pie,
    PieChart,
    Sector,
    Tooltip,
} from 'recharts';

import { preparePctData } from '../../api/chartHelpers';
import { humanPctFormat, numFormat } from '../../api/helpers';

import LastUpdateTag from '../general/LastUpdateTag';

import './Charts.scss';

const CustomLabel = (showName, formatPercent) =>
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

function TisPieChart({
    pie,
    disclaimer = null,
    lastUpdate = true,
    nameLabels = false,
    percent = true,
    subtitle,
    timestamp,
    title,
}) {
    if (!pie || !Array.isArray(pie.data ?? false) || !pie.data.length) {
        return null;
    }

    const data = percent ? preparePctData(pie.data, pie.key) : pie.data;

    const [activeSegment, setActiveSegment] = useState(null);

    const label = CustomLabel(nameLabels, percent);

    const renderActiveShape = ({
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
    }) => {
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
    };

    const renderInactiveShape = ({
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
    }) => {
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
    };

    const pieClick = (segmentProps, segmentKey) => {
        setActiveSegment(segmentKey === activeSegment ? null : segmentKey);
    };

    const pieOver = (segmentProps, segmentKey) => {
        if (segmentKey !== activeSegment) {
            setActiveSegment(segmentKey);
        }
    };

    const pieOut = () => {
        setActiveSegment(null);
    };

    return (
        <div className="chart-wrapper pie-chart">
            {title && <h2 className={subtitle ? '' : 'mb-3'}>{title}</h2>}
            {subtitle && <h6>{subtitle}</h6>}
            {lastUpdate && (
                <LastUpdateTag timestamp={timestamp ?? null}>
                    {disclaimer}
                </LastUpdateTag>
            )}
            <div className="chart-outer mt-3">
                <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <Pie
                                activeIndex={activeSegment}
                                activeShape={renderActiveShape}
                                inactiveShape={renderInactiveShape}
                                data={data}
                                dataKey={pie.key}
                                nameKey={pie.name}
                                cx="50%"
                                cy="50%"
                                innerRadius="50%"
                                outerRadius="80%"
                                paddingAngle={1}
                                fill={pie.color}
                                label={label}
                                animationDuration={750}
                                onClick={pieClick}
                                onMouseOver={pieOver}
                                onMouseOut={pieOut}
                            >
                                {pie.data.map((entry) => (
                                    <Cell
                                        key={`cell-${entry[pie.key]}`}
                                        fill={entry.color ?? null}
                                        // stroke="#444444"
                                    />
                                ))}
                            </Pie>
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                            />
                            <Tooltip
                                formatter={percent ? humanPctFormat : numFormat}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default TisPieChart;
