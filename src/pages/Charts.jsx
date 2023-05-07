import { getPartyChartLabel } from '../api/chartHelpers';
import { colors, labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';

import useAdsData from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisBarChart from '../components/charts/TisBarChart';

const amountBars = [
    {
        key: 'num',
        name: labels.ads.amount,
        color: colors.colorOrange,
    },
];

function Charts() {
    const { metaApiData, findPartyForFbAccount } = useAdsData();
    const { csvData } = useCsvData();

    const pages = [];
    const partiesAggr = {};
    const amounts = [];
    const amountsAggr = {};
    let timestamp = 0;
    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const [fbName, party] = findPartyForFbAccount(pageId, csvData);
            if (fbName) {
                if (partiesAggr[fbName] ?? false) {
                    partiesAggr[fbName].range[0] += pageProps.min;
                    partiesAggr[fbName].range[1] += pageProps.max;
                    partiesAggr[fbName].est += pageProps.est;
                    amountsAggr[fbName].num += pageProps.ads;
                } else {
                    partiesAggr[fbName] = {
                        name: party ? getPartyChartLabel(party) : fbName,
                        range: [pageProps.min, pageProps.max],
                        est: pageProps.est,
                    };
                    amountsAggr[fbName] = {
                        name: party ? getPartyChartLabel(party) : fbName,
                        num: pageProps.ads,
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
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.disclaimerMetaRange}
                timestamp={timestamp}
                title={labels.ads.rangesPartiesTitle}
                vertical
            />
            <TisBarChart
                bars={amountBars}
                data={Object.values(amountsAggr).sort(sortByNumericProp('num'))}
                timestamp={timestamp}
                title={labels.ads.amountPartiesTitle}
                vertical
            />
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.disclaimerMetaRange}
                namesLength={40}
                timestamp={timestamp}
                title={labels.ads.rangesAccountsTitle}
                vertical
            />
            <TisBarChart
                bars={amountBars}
                data={amounts.sort(sortByNumericProp('num'))}
                namesLength={40}
                timestamp={timestamp}
                title={labels.ads.amountAccountsTitle}
                vertical
            />
        </section>
    );
}

export default Charts;
