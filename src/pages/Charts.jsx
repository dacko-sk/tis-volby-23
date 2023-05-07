import { getPartyChartLabel } from '../api/chartHelpers';
import { colors, labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';

import useAdsData from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisBarChart from '../components/charts/TisBarChart';

function Charts() {
    const { metaApiData, findPartyForFbAccount } = useAdsData();
    const { csvData } = useCsvData();

    const pages = [];
    const partiesAggr = {};
    const amounts = [];
    let timestamp = 0;
    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const [fbName, party] = findPartyForFbAccount(pageId, csvData);
            if (fbName) {
                if (partiesAggr[fbName] ?? false) {
                    partiesAggr[fbName].range[0] += pageProps.min;
                    partiesAggr[fbName].range[1] += pageProps.max;
                    partiesAggr[fbName].est += pageProps.est;
                } else {
                    partiesAggr[fbName] = {
                        id: pageId,
                        name: party ? getPartyChartLabel(party) : fbName,
                        range: [pageProps.min, pageProps.max],
                        est: pageProps.est,
                    };
                }
            }
            pages.push({
                id: pageId,
                name: pageProps.name,
                range: [pageProps.min, pageProps.max],
                est: pageProps.est,
            });
            amounts.push({
                id: pageId,
                name: pageProps.name,
                num: pageProps.ads,
            });
            timestamp = Math.max(timestamp, pageProps.updated);
        });
        pages.sort(sortByNumericProp('est'));
        amounts.sort(sortByNumericProp('num'));
    }

    if (!metaApiData.lastUpdate || metaApiData.error) {
        // waiting for data or error in loding
        return <Loading error={metaApiData.error} />;
    }

    setTitle('Grafy');

    return (
        <section className="charts-page">
            <Title>Grafy</Title>
            <FbRangesChart
                data={pages}
                disclaimer={labels.ads.disclaimerMetaRange}
                vertical
                timestamp={timestamp}
                title={labels.ads.rangesTitle}
            />
            <FbRangesChart
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.disclaimerMetaRange}
                vertical
                timestamp={timestamp}
                title={labels.ads.rangesTitle}
            />
            <TisBarChart
                bars={[
                    {
                        key: 'num',
                        name: labels.ads.amount,
                        color: colors.colorOrange,
                    },
                ]}
                data={amounts}
                timestamp={timestamp}
                title={labels.ads.amountTitle}
                vertical
            />
        </section>
    );
}

export default Charts;
