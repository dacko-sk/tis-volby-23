import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import { getPartyChartLabel } from '../api/chartHelpers';
import { colors, labels } from '../api/constants';
import { setTitle, sortByNumericProp, sortBySpending } from '../api/helpers';

import useAdsData from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisBarChart from '../components/charts/TisBarChart';

const bars = {
    amount: [
        {
            key: 'num',
            name: labels.ads.amount,
            color: colors.colorOrange,
        },
    ],
    spending: [
        {
            key: 'outgoing',
            name: labels.charts.outgoing,
            color: colors.colorDarkBlue,
        },
    ],
};

const chartKeys = {
    RANGES_PARTIES: labels.ads.rangesPartiesTitle,
    RANGES_ACCOUNTS: labels.ads.rangesAccountsTitle,
    SPENDING_PARTIES: labels.ads.spendingPartiesTitle,
    SPENDING_ACCOUNTS: labels.ads.spendingAccountsTitle,
    AMOUNTS_PARTIES: labels.ads.amountPartiesTitle,
    AMOUNTS_ACCOUNTS: labels.ads.amountAccountsTitle,
};

function Charts() {
    const [activeKeys, setActiveKeys] = useState([chartKeys.RANGES_PARTIES]);
    const [loadedCharts, setLoadedCharts] = useState([
        chartKeys.RANGES_PARTIES,
    ]);

    const { metaApiData, sheetsData, mergedWeeksData, findPartyForFbAccount } =
        useAdsData();
    const { csvData } = useCsvData();

    // parse data from API
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
                } else {
                    partiesAggr[fbName] = {
                        name: party ? getPartyChartLabel(party) : fbName,
                        range: [pageProps.min, pageProps.max],
                        est: pageProps.est,
                    };
                }
                if (loadedCharts.includes(chartKeys.AMOUNTS_PARTIES)) {
                    if (amountsAggr[fbName] ?? false) {
                        amountsAggr[fbName].num += pageProps.ads;
                    } else {
                        amountsAggr[fbName] = {
                            name: party ? getPartyChartLabel(party) : fbName,
                            num: pageProps.ads,
                        };
                    }
                }
            }
            if (loadedCharts.includes(chartKeys.RANGES_ACCOUNTS)) {
                pages.push({
                    id: pageId,
                    name: pageProps.name,
                    range: [pageProps.min, pageProps.max],
                    est: pageProps.est,
                });
            }
            if (loadedCharts.includes(chartKeys.AMOUNTS_ACCOUNTS)) {
                amounts.push({
                    id: pageId,
                    name: pageProps.name,
                    num: pageProps.ads,
                });
            }
            timestamp = Math.max(timestamp, pageProps.updated);
        });
    }

    // parse data from sheets
    let spending = [];
    const spendingAggr = {};
    if (sheetsData.lastUpdate) {
        if (loadedCharts.includes(chartKeys.SPENDING_PARTIES)) {
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
        if (loadedCharts.includes(chartKeys.SPENDING_ACCOUNTS)) {
            spending = Object.values(mergedWeeksData);
        }
    }

    const charts = {
        [chartKeys.RANGES_PARTIES]: (
            <FbRangesChart
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.disclaimerMetaRange}
                timestamp={timestamp}
                vertical
            />
        ),
        [chartKeys.AMOUNTS_PARTIES]: loadedCharts.includes(
            chartKeys.AMOUNTS_PARTIES
        ) ? (
            <TisBarChart
                bars={bars.amount}
                data={Object.values(amountsAggr).sort(sortByNumericProp('num'))}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.RANGES_ACCOUNTS]: loadedCharts.includes(
            chartKeys.RANGES_ACCOUNTS
        ) ? (
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.disclaimerMetaRange}
                namesLength={40}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_ACCOUNTS]: loadedCharts.includes(
            chartKeys.AMOUNTS_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={bars.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                namesLength={40}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.SPENDING_PARTIES]: loadedCharts.includes(
            chartKeys.SPENDING_PARTIES
        ) ? (
            <TisBarChart
                bars={bars.spending}
                currency
                data={Object.values(spendingAggr).sort(sortBySpending)}
                namesLength={40}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
        [chartKeys.SPENDING_ACCOUNTS]: loadedCharts.includes(
            chartKeys.SPENDING_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={bars.spending}
                currency
                data={spending.sort(sortBySpending)}
                namesLength={40}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
    };

    const accordions = [];
    Object.values(chartKeys).forEach((chartKey) => {
        accordions.push(
            <Accordion.Item key={chartKey} eventKey={chartKey}>
                <Accordion.Header>{chartKey}</Accordion.Header>
                <Accordion.Body>{charts[chartKey]}</Accordion.Body>
            </Accordion.Item>
        );
    });

    if (!metaApiData.lastUpdate || metaApiData.error) {
        // waiting for data or error in loding
        return <Loading error={metaApiData.error} />;
    }

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKeys(ak);
        // remember if chart was already loaded
        ak.forEach((key) => {
            if (!loadedCharts.includes(key)) {
                setLoadedCharts([...loadedCharts, ...[key]]);
            }
        });
    };

    setTitle('Grafy');

    return (
        <section className="charts-page">
            <Title>Grafy</Title>
            <Accordion
                className="mt-4"
                activeKey={activeKeys}
                alwaysOpen
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </section>
    );
}

export default Charts;
