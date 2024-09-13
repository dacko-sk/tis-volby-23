import { dates } from '../../api/constants';
import { labels, t } from '../../api/dictionary';
import { getPartyChartLabel } from '../../api/chartHelpers';
import {
    getTimeFromDate,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';
import { routes } from '../../api/routes';

import useAdsData from '../../context/AdsDataContext';
import useData, { csvAggregatedKeys } from '../../context/DataContext';

import TisBarChart, { columnVariants } from './TisBarChart';

function Top10({ finalReport = false, maxItems = 10 }) {
    const { csvData, findPartyByFbName } = useData();

    if (finalReport) {
        const { sheetsData } = useAdsData();
        let columns = [];
        if (sheetsData.loaded) {
            const parties = {};
            Object.entries(sheetsData.campaign).forEach(([fbName, amount]) => {
                parties[fbName] = {
                    campaign: amount,
                    precampaign: 0,
                    total: amount,
                };
            });
            Object.entries(sheetsData.precampaign).forEach(
                ([fbName, amount]) => {
                    const campaign = parties[fbName].campaign ?? 0;
                    parties[fbName] = {
                        campaign,
                        precampaign: amount,
                        total: amount + campaign,
                    };
                }
            );
            columns = Object.entries(parties).map(([fbName, chartData]) => {
                const party = findPartyByFbName(fbName);
                return {
                    name: party ? getPartyChartLabel(party) : fbName,
                    ...chartData,
                };
            });
        }

        return (
            <TisBarChart
                bars={columnVariants.finalReport}
                buttonLink={routes.charts}
                className="mb-4"
                currency
                data={columns
                    .sort(sortByNumericProp('total'))
                    .slice(0, maxItems)}
                showSum
                subtitle={`${t(labels.charts.finalReport.disclaimer)} ${t(
                    labels.charts.disclaimerClick
                )}`}
                title={t(labels.charts.finalReport.title)}
                timestamp={getTimeFromDate(dates.monitoringEnd)}
                vertical
            />
        );
    }

    const columns =
        csvData.data ?? false
            ? csvData.data.map((row) => ({
                  name: getPartyChartLabel(row),
                  incoming: row[csvAggregatedKeys.incoming],
                  outgoing: row[csvAggregatedKeys.outgoing],
              }))
            : [];

    return (
        <TisBarChart
            buttonLink={routes.charts}
            className="mb-4"
            currency
            data={columns.sort(sortBySpending).slice(0, maxItems)}
            subtitle={`${t(labels.charts.disclaimer)} ${t(
                labels.charts.disclaimerClick
            )}`}
            title={t(labels.charts.top10)}
            vertical
        />
    );
}

export default Top10;
