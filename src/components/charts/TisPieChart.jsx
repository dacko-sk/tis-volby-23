import { useState } from 'react';
import { ResponsiveContainer, Pie, PieChart, Sector, Tooltip } from 'recharts';

import { preparePctData } from '../../api/chartHelpers';
import { humanPctFormat } from '../../api/helpers';

import LastUpdateTag from '../general/LastUpdateTag';

import './Charts.scss';

function TisPieChart({
    pie,
    disclaimer = null,
    lastUpdate = true,
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

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        // innerRadius,
        outerRadius,
        name,
        fill,
    }) => {
        const radius = outerRadius + 25;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={fill}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {name}
            </text>
        );
    };

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
                            <Tooltip formatter={humanPctFormat} />
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
                                label={renderCustomizedLabel}
                                animationDuration={750}
                                onClick={pieClick}
                                onMouseOver={pieOver}
                                onMouseOut={pieOut}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default TisPieChart;
