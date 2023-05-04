import { useQuery } from '@tanstack/react-query';
import has from 'has';

import { getPartyChartLabel } from '../api/chartHelpers';
import { colors, labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';

import useAdsData, { findPartyForFbAccount } from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisBarChart from '../components/charts/TisBarChart';

function Charts() {
    const { adsData } = useAdsData();
    const { csvData } = useCsvData();

    // load chart data
    const { isLoading, error, data } = useQuery([`fb_chart_all`], () =>
        fetch(
            'https://volby.transparency.sk/api/meta/ads_archive.php?page=all'
        ).then((response) => response.json())
    );

    const pages = [];
    const partiesAggr = {};
    const amounts = [];
    let timestamp = 0;
    if (!isLoading && !error && data && has(data, 'pages')) {
        Object.entries(data.pages).forEach(([pageId, pageProps]) => {
            const party = findPartyForFbAccount(pageId, adsData, csvData);
            if (party) {
                if (has(partiesAggr, party.slug)) {
                    partiesAggr[party.slug].range[0] += pageProps.min;
                    partiesAggr[party.slug].range[1] += pageProps.max;
                    partiesAggr[party.slug].est += pageProps.est;
                } else {
                    partiesAggr[party.slug] = {
                        id: pageId,
                        name: getPartyChartLabel(party),
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

    if (isLoading || error) {
        // waiting for data or error in loding
        return <Loading error={error} />;
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
