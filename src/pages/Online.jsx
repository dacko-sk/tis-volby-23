import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {
    attributionDefs,
    getPartyChartLabel,
    regionDefs,
} from '../api/chartHelpers';
import { colors, labels } from '../api/constants';
import {
    setTitle,
    sortByName,
    sortByNumericProp,
    sortBySpending,
} from '../api/helpers';

import useAdsData from '../context/AdsDataContext';
import useCsvData from '../context/DataContext';

import FbRangesChart from '../components/charts/FbRangesChart';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import AlertWithIcon from '../components/general/AlertWithIcon';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import TisPieChart from '../components/charts/TisPieChart';

const chartKeys = {
    SPENDING_PARTIES: labels.ads.weeklySpending.partiesTitle,
    SPENDING_ACCOUNTS: labels.ads.weeklySpending.accountsTitle,
    RANGES_PARTIES: labels.ads.ranges.partiesTitle,
    RANGES_ACCOUNTS: labels.ads.ranges.accountsTitle,
    AMOUNTS_PARTIES: labels.ads.amount.partiesTitle,
    AMOUNTS_ACCOUNTS: labels.ads.amount.accountsTitle,
    REGIONS: labels.ads.regions.title,
    DEMOGRAPHY: labels.ads.demography.title,
    ATTRIBUTION: labels.ads.attribution.title,
};

const pageTitle = 'Online kampane';

function Online() {
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING_PARTIES]);
    const [loadedCharts, setLoadedCharts] = useState([
        chartKeys.SPENDING_PARTIES,
    ]);

    const { metaApiData, sheetsData, mergedWeeksData, findPartyForFbAccount } =
        useAdsData();
    const { findPartyByFbName } = useCsvData();

    // parse data from sheets
    let spending = [];
    const spendingAggr = {};
    if (sheetsData.lastUpdate) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const parentPartyName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(parentPartyName);
            if (parentPartyName) {
                if (spendingAggr[parentPartyName] ?? false) {
                    spendingAggr[parentPartyName].outgoing +=
                        pageProps.outgoing;
                } else {
                    spendingAggr[parentPartyName] = {
                        name: party
                            ? getPartyChartLabel(party)
                            : parentPartyName,
                        outgoing: pageProps.outgoing,
                    };
                }
            }
        });
        if (loadedCharts.includes(chartKeys.SPENDING_ACCOUNTS)) {
            spending = Object.values(mergedWeeksData);
        }
    }

    // parse data from API
    const pages = [];
    const partiesAggr = {};
    const amounts = [];
    const amountsAggr = {};
    const regionsAggr = {};
    const regionsPercentages = [];
    const regionsBars = [];
    const attributions = {};
    const attributionsAggr = {};
    const attributionsPercentages = [];
    const attributionsPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: labels.ads.attribution.amount,
    };
    let timestamp = 0;

    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const parentPartyName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(parentPartyName);
            const partyChartLabel = party
                ? getPartyChartLabel(party)
                : parentPartyName;

            if (parentPartyName) {
                if (loadedCharts.includes(chartKeys.RANGES_PARTIES)) {
                    if (partiesAggr[parentPartyName] ?? false) {
                        partiesAggr[parentPartyName].range[0] +=
                            pageProps.spend.min;
                        partiesAggr[parentPartyName].range[1] +=
                            pageProps.spend.max;
                        partiesAggr[parentPartyName].est += pageProps.spend.est;
                    } else {
                        partiesAggr[parentPartyName] = {
                            name: partyChartLabel,
                            range: [pageProps.spend.min, pageProps.spend.max],
                            est: pageProps.spend.est,
                        };
                    }
                }

                if (loadedCharts.includes(chartKeys.AMOUNTS_PARTIES)) {
                    if (amountsAggr[parentPartyName] ?? false) {
                        amountsAggr[parentPartyName].num += pageProps.spend.num;
                    } else {
                        amountsAggr[parentPartyName] = {
                            name: partyChartLabel,
                            num: pageProps.spend.num,
                        };
                    }
                }

                if (loadedCharts.includes(chartKeys.REGIONS)) {
                    // create initial object for party
                    if (!(regionsAggr[partyChartLabel] ?? false)) {
                        regionsAggr[partyChartLabel] = {};
                        Object.keys(regionDefs).forEach((regionKey) => {
                            regionsAggr[partyChartLabel][regionKey] = 0;
                        });
                    }
                    // aggregate regions from all acounts of the party
                    Object.keys(regionDefs).forEach((regionKey) => {
                        if (pageProps.regions[regionKey] ?? false) {
                            regionsAggr[partyChartLabel][regionKey] +=
                                pageProps.regions[regionKey];
                        }
                    });
                }

                if (loadedCharts.includes(chartKeys.ATTRIBUTION)) {
                    let amount = 0;
                    let correct = 0;
                    // count YES & NO amounts, ignore N/A amounts
                    if (pageProps.attribution.mandatory.YES ?? false) {
                        amount += pageProps.attribution.mandatory.YES;
                        correct += pageProps.attribution.mandatory.YES;
                    }
                    if (pageProps.attribution.mandatory.NO ?? false) {
                        amount += pageProps.attribution.mandatory.NO;
                    }
                    if (amount) {
                        if (attributionsAggr[parentPartyName] ?? false) {
                            attributionsAggr[parentPartyName].amount += amount;
                            attributionsAggr[parentPartyName].correct +=
                                correct;
                        } else {
                            attributionsAggr[parentPartyName] = {
                                name: party
                                    ? getPartyChartLabel(party)
                                    : parentPartyName,
                                amount,
                                correct,
                            };
                        }
                    }
                }
            }

            if (loadedCharts.includes(chartKeys.RANGES_ACCOUNTS)) {
                pages.push({
                    id: pageId,
                    name: pageProps.name,
                    range: [pageProps.spend.min, pageProps.spend.max],
                    est: pageProps.spend.est,
                });
            }

            if (loadedCharts.includes(chartKeys.AMOUNTS_ACCOUNTS)) {
                amounts.push({
                    id: pageId,
                    name: pageProps.name,
                    num: pageProps.spend.num,
                });
            }

            if (loadedCharts.includes(chartKeys.ATTRIBUTION)) {
                Object.keys(attributionDefs).forEach((aKey) => {
                    if (pageProps.attribution.mandatory[aKey] ?? false) {
                        attributions[aKey] =
                            (attributions[aKey] ?? 0) +
                            pageProps.attribution.mandatory[aKey];
                    }
                });
            }

            timestamp = Math.max(timestamp, pageProps.updated);
        });

        // sort & preprocess aggregated data for charts
        Object.entries(regionsAggr).forEach(
            ([partyChartLabel, partyRegions]) => {
                const dataPoint = {
                    name: partyChartLabel,
                };
                let sum = 0;
                Object.values(partyRegions).forEach((regionShare) => {
                    sum += regionShare;
                });
                Object.entries(partyRegions).forEach(
                    ([regionKey, regionShare]) => {
                        dataPoint[regionKey] = regionShare / sum;
                    }
                );
                regionsPercentages.push(dataPoint);
            }
        );
        regionsPercentages.sort(sortByName);
        Object.entries(regionDefs).forEach(([regionKey, regionProps]) => {
            regionsBars.push({
                key: regionKey,
                name: regionProps.name,
                color: regionProps.color,
                stackId: 'regions',
            });
        });

        Object.values(attributionsAggr).forEach((partyAttribution) => {
            attributionsPercentages.push({
                name: partyAttribution.name,
                pct: partyAttribution.correct / partyAttribution.amount,
            });
        });
        attributionsPercentages.sort(sortByNumericProp('pct'));

        Object.entries(attributionDefs).forEach(([aKey, aProps]) => {
            if (attributions[aKey] ?? false) {
                attributionsPie.data.push({
                    name: aProps.name,
                    value: attributions[aKey],
                    color: aProps.color,
                });
            }
        });
    }

    const charts = {
        [chartKeys.SPENDING_PARTIES]: loadedCharts.includes(
            chartKeys.SPENDING_PARTIES
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={Object.values(spendingAggr).sort(sortBySpending)}
                subtitle={labels.ads.weeklySpending.partiesDisclaimer}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
        [chartKeys.SPENDING_ACCOUNTS]: loadedCharts.includes(
            chartKeys.SPENDING_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={spending.sort(sortBySpending)}
                subtitle={labels.ads.weeklySpending.disclaimer}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
        [chartKeys.RANGES_PARTIES]: (
            <FbRangesChart
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                subtitle={labels.ads.ranges.disclaimer}
                timestamp={timestamp}
                vertical
            />
        ),
        [chartKeys.RANGES_ACCOUNTS]: loadedCharts.includes(
            chartKeys.RANGES_ACCOUNTS
        ) ? (
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                subtitle={labels.ads.ranges.disclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_PARTIES]: loadedCharts.includes(
            chartKeys.AMOUNTS_PARTIES
        ) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={Object.values(amountsAggr).sort(sortByNumericProp('num'))}
                subtitle={labels.ads.amount.disclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_ACCOUNTS]: loadedCharts.includes(
            chartKeys.AMOUNTS_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                subtitle={labels.ads.amount.disclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.REGIONS]: loadedCharts.includes(chartKeys.REGIONS) ? (
            <TisBarChart
                bars={regionsBars}
                data={regionsPercentages}
                percent
                subtitle={labels.ads.regions.allDisclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.ATTRIBUTION]: loadedCharts.includes(
            chartKeys.ATTRIBUTION
        ) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        pie={attributionsPie}
                        percent={false}
                        subtitle={labels.ads.attribution.disclaimer}
                        timestamp={timestamp}
                        title={labels.ads.attribution.allTitle}
                    />
                </Col>
                <Col xl={6}>
                    <TisBarChart
                        bars={columnVariants.percent}
                        data={attributionsPercentages}
                        percent
                        subtitle={labels.ads.attribution.pctDisclaimer}
                        timestamp={timestamp}
                        title={labels.ads.attribution.pctTitle}
                        vertical
                    />
                </Col>
            </Row>
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

    setTitle(pageTitle);

    return (
        <section className="charts-page">
            <Title>{pageTitle}</Title>

            <AlertWithIcon className="my-4" variant="primary">
                Politickú reklamu strán a ich politikov na sociálnej sieti
                Facebook sledujeme vďaka údajom, ktoré publikuje spoločnosť META
                v knižnici Ad Facebook Library.
                <br />
                Sumy sú uvedené bez DPH.
            </AlertWithIcon>
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

export default Online;
