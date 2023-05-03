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

import { tooltipNameFormat } from '../../api/chartHelpers';
import { colors, labels } from '../../api/constants';
import { numFormat, wholeCurrencyFormat } from '../../api/helpers';

import { tickFontSize } from './VerticalTick';

import './Charts.scss';
import LastUpdateTag from '../accounts/LastUpdateTag';

function FbRanges({
    data,
    disclaimer = null,
    timestamp,
    title,
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

    return (
        <div className="chart-wrapper mb-3">
            <h2>{title}</h2>
            <LastUpdateTag timestamp={timestamp}>{disclaimer}</LastUpdateTag>

            <div className="chart-outer">
                <div
                    className="chart"
                    style={
                        vertical
                            ? {
                                  height: `${55 + data.length * 40}px`,
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
                                left: 15,
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
                                    type="number"
                                    tickFormatter={wholeCurrencyFormat}
                                    tick={axisConfig}
                                />
                            ) : (
                                <XAxis
                                    type="category"
                                    dataKey="name"
                                    tick={axisConfig}
                                    minTickGap={-10}
                                    height={30}
                                />
                            )}
                            {vertical ? (
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={axisConfig}
                                    minTickGap={-15}
                                    width={160}
                                />
                            ) : (
                                <YAxis
                                    type="number"
                                    tickFormatter={wholeCurrencyFormat}
                                    tick={axisConfig}
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
                                name={labels.ads.barRange}
                            />
                            <Scatter
                                dataKey="est"
                                fill={colors.colorOrange}
                                name={labels.ads.scatterEstimate}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default FbRanges;
