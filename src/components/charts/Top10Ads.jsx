import { labels } from '../../api/constants';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { fixNumber, sortBySpending } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';
import useData from '../../context/DataContext';

import TisBarChart, { columnVariants } from './TisBarChart';

function Top10Ads({ maxItems = 10 }) {
    const {
        findPartyForFbAccount,
        findPartyForGoogleAccount,
        mergedWeeksData,
        sheetsData,
    } = useAdsData();
    const { findPartyByFbName } = useData();

    // parse data
    const spendingFb = {};
    if (sheetsData.lastUpdateFb) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const fbName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(fbName);
            if (fbName) {
                if (spendingFb[fbName] ?? false) {
                    spendingFb[fbName].outgoing += pageProps.outgoing;
                } else {
                    spendingFb[fbName] = {
                        name: party
                            ? getPartyChartLabel(party, segments.ONLINE)
                            : fbName,
                        outgoing: pageProps.outgoing,
                    };
                }
            }
        });
    }
    const spendingGgl = {};
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const parentPartyName = findPartyForGoogleAccount(
                pageData[sheetsConfig.GOOGLE.columns.ID]
            );
            const party = findPartyByFbName(parentPartyName);
            const partyChartLabel = party
                ? getPartyChartLabel(party, segments.ONLINE)
                : parentPartyName;
            const outgoing = fixNumber(
                pageData[sheetsConfig.GOOGLE.columns.SPENDING]
            );
            if (parentPartyName) {
                if (spendingGgl[parentPartyName] ?? false) {
                    spendingGgl[parentPartyName].outgoing += outgoing;
                } else {
                    spendingGgl[parentPartyName] = {
                        name: partyChartLabel,
                        outgoing,
                    };
                }
            }
        });
    }

    const columnsFb = Object.values(spendingFb)
        .sort(sortBySpending)
        .slice(0, maxItems);
    const columnsGgl = Object.values(spendingGgl)
        .sort(sortBySpending)
        .slice(0, maxItems);

    return (
        <div className="online-charts">
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={columnsFb}
                subtitle={labels.ads.meta.spending.partiesDisclaimer}
                timestamp={sheetsData.lastUpdateFb}
                title={labels.ads.meta.topTitle.replace(
                    '%s',
                    Math.min(maxItems, columnsFb.length)
                )}
                vertical
            />
            <TisBarChart
                bars={columnVariants.spending}
                buttonLink={routes.online()}
                buttonText={labels.ads.showMore}
                currency
                data={columnsGgl}
                subtitle={labels.ads.google.spending.partiesDisclaimer}
                timestamp={sheetsData.lastUpdateGgl}
                title={labels.ads.google.topTitle.replace(
                    '%s',
                    Math.min(maxItems, columnsGgl.length)
                )}
                vertical
            />
        </div>
    );
}

export default Top10Ads;
