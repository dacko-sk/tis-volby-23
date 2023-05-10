import { labels } from '../../api/constants';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';

import useAdsData from '../../context/AdsDataContext';
import useData from '../../context/DataContext';

import TisBarChart, { columnVariants } from './TisBarChart';

function Top10Ads({ maxItems = 10 }) {
    const { findPartyForFbAccount, mergedWeeksData, sheetsData } = useAdsData();
    const { csvData } = useData();

    // parse data
    const spendingAggr = {};
    if (sheetsData.lastUpdate) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const [fbName, party] = findPartyForFbAccount(pageId, csvData);
            if (fbName) {
                if (spendingAggr[fbName] ?? false) {
                    spendingAggr[fbName].outgoing += pageProps.outgoing;
                } else {
                    spendingAggr[fbName] = {
                        name: party ? getPartyChartLabel(party) : fbName,
                        outgoing: pageProps.outgoing,
                    };
                }
            }
        });
    }
    const columns = Object.values(spendingAggr)
        .sort(sortBySpending)
        .slice(0, maxItems);

    return (
        <TisBarChart
            bars={columnVariants.spending}
            buttonLink={routes.online}
            buttonText="Zistiť viac o online kampani"
            currency
            data={columns}
            disclaimer={labels.ads.spendingDisclaimer}
            namesLength={40}
            timestamp={sheetsData.lastUpdate}
            title={`Top ${columns.length} online kampaní`}
            vertical
        />
    );
}

export default Top10Ads;
