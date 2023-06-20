import { labels } from '../../api/constants';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { sortBySpending } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

import useAdsData from '../../context/AdsDataContext';
import useData from '../../context/DataContext';

import TisBarChart, { columnVariants } from './TisBarChart';

function Top10Ads({ maxItems = 10 }) {
    const { findPartyForFbAccount, mergedWeeksData, sheetsData } = useAdsData();
    const { findPartyByFbName } = useData();

    // parse data
    const spendingAggr = {};
    if (sheetsData.lastUpdate) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const fbName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(fbName);
            if (fbName) {
                if (spendingAggr[fbName] ?? false) {
                    spendingAggr[fbName].outgoing += pageProps.outgoing;
                } else {
                    spendingAggr[fbName] = {
                        name: party
                            ? getPartyChartLabel(party, segments.ONLINE)
                            : fbName,
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
            buttonText={labels.ads.showMore}
            currency
            data={columns}
            subtitle={labels.ads.weeklySpending.partiesDisclaimer}
            timestamp={sheetsData.lastUpdate}
            title={labels.ads.weeklySpending.topTitle}
            vertical
        />
    );
}

export default Top10Ads;
