import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    isMobile,
    shortChartNames,
    tooltipNameFormat,
    verticalYaxisWidth,
} from '../../api/chartHelpers';
import { colors, labels } from '../../api/constants';
import { numFormat, wholeCurrencyFormat } from '../../api/helpers';
import { separators } from '../../api/routes';

import HorizontalTick from './HorizontalTick';
import VerticalTick, { tickFontSize } from './VerticalTick';

import './Charts.scss';
import LastUpdateTag from '../general/LastUpdateTag';

function FbRangesChart({
    className = '',
    data,
    disclaimer = null,
    timestamp,
    title,
    subtitle,
    vertical = false,
}) {
    if (!data || !Array.isArray(data) || !data.length) {
        return null;
    }

    const axisConfig = {
        fill: '#333',
        fontSize: tickFontSize,
    };
    const tooltipValueFormat = (value) => {
        if (Array.isArray(value) && value.length > 1) {
            return `${numFormat(value[0])} ~ ${wholeCurrencyFormat(value[1])}`;
        }
        return wholeCurrencyFormat(value);
    };

    let labelLines = 1;
    data.forEach((row) => {
        labelLines = Math.max(
            labelLines,
            row.name.split(separators.newline).length
        );
    });

    return (
        <div className={`chart-wrapper ${className}`}>
            {title && <h2 className={subtitle ? '' : 'mb-3'}>{title}</h2>}
            {subtitle && <h6>{subtitle}</h6>}
            <LastUpdateTag timestamp={timestamp}>{disclaimer}</LastUpdateTag>

            <div className="chart-outer">
                <div
                    className="chart"
                    style={
                        vertical
                            ? {
                                  height: `${
                                      (isMobile ? 80 : 55) + data.length * 40
                                  }px`,
                              }
                            : {}
                    }
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            layout={vertical ? 'vertical' : 'horizontal'}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3"
                                horizontal={!vertical}
                                vertical={vertical}
                            />
                            {vertical ? (
                                <XAxis
                                    tick={axisConfig}
                                    tickCount={7}
                                    tickFormatter={wholeCurrencyFormat}
                                    type="number"
                                />
                            ) : (
                                <XAxis
                                    type="category"
                                    dataKey="name"
                                    tickFormatter={shortChartNames}
                                    tick={
                                        labelLines > 1 ? (
                                            <HorizontalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    minTickGap={-10}
                                    height={30}
                                />
                            )}
                            {vertical ? (
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tickFormatter={shortChartNames}
                                    tick={
                                        labelLines > 1 ? (
                                            <VerticalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    minTickGap={-15}
                                    width={verticalYaxisWidth}
                                />
                            ) : (
                                <YAxis
                                    tick={axisConfig}
                                    tickCount={7}
                                    tickFormatter={wholeCurrencyFormat}
                                    type="number"
                                />
                            )}
                            <Tooltip
                                formatter={tooltipValueFormat}
                                labelFormatter={tooltipNameFormat}
                            />
                            <Legend />
                            <Bar
                                key="range"
                                dataKey="range"
                                fill={colors.colorDarkBlue}
                                name={labels.ads.meta.ranges.range}
                            />
                            <Scatter
                                dataKey="est"
                                fill={colors.colorOrange}
                                name={labels.ads.meta.ranges.estimate}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default FbRangesChart;
