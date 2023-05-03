import { useQuery } from '@tanstack/react-query';
import has from 'has';

import { colors, labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';

import FbRangesChart from '../components/charts/FbRangesChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisBarChart from '../components/charts/TisBarChart';

function Charts() {
    // load chart data
    const { isLoading, error, data } = useQuery([`fb_chart_all`], () =>
        fetch(
            'https://volby.transparency.sk/api/meta/ads_archive.php?page=all'
        ).then((response) => response.json())
    );

    const pages = [];
    const amounts = [];
    let timestamp = 0;
    if (!isLoading && !error && data && has(data, 'pages')) {
        Object.entries(data.pages).forEach(([pageId, pageProps]) => {
            pages.push({
                id: pageId,
                name: pageProps.name,
                range: [pageProps.min, pageProps.max],
                est: pageProps.max - pageProps.ads * 49,
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
