import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../api/browserHelpers';
import {
    ageColors,
    attributionColors,
    attributionKeys,
    genderColors,
    genderKeys,
    getPartyChartLabel,
    regionOptions,
    regionKeys,
} from '../../api/chartHelpers';
import { colors } from '../../api/constants';
import { labels, t } from '../../api/dictionary';
import {
    sortByName,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';
import { segments } from '../../api/routes';

import useAdsData from '../../context/AdsDataContext';
import useCsvData from '../../context/DataContext';

import FbRangesChart from '../charts/FbRangesChart';
import TisBarChart, { columnVariants } from '../charts/TisBarChart';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import TisPieChart from '../charts/TisPieChart';

function Meta({
    chartKeys = {
        SPENDING_PARTIES: 'SPENDING_PARTIES',
        SPENDING_ACCOUNTS: 'SPENDING_ACCOUNTS',
        RANGES_PARTIES: 'RANGES_PARTIES',
        RANGES_ACCOUNTS: 'RANGES_ACCOUNTS',
        AMOUNTS_PARTIES: 'AMOUNTS_PARTIES',
        AMOUNTS_ACCOUNTS: 'AMOUNTS_ACCOUNTS',
        REGIONS: 'REGIONS',
        DEMOGRAPHY: 'DEMOGRAPHY',
        ATTRIBUTION: 'ATTRIBUTION',
    },
}) {
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
    if (sheetsData.lastUpdateFb) {
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
                            ? getPartyChartLabel(party, segments.ONLINE)
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
    const genderAggr = {};
    const genderPercentages = [];
    const genderBars = [];
    const ageAggr = {};
    const agePercentages = [];
    const ageBars = [];
    const attributions = {};
    const attributionsAggr = {};
    const attributionsPercentages = [];
    const attributionsBars = [];
    const attributionsPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.ads.meta.attribution.amount),
    };
    let timestamp = 0;

    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const parentPartyName = findPartyForFbAccount(pageId);
            const party = findPartyByFbName(parentPartyName);
            const partyChartLabel = party
                ? getPartyChartLabel(party, segments.ONLINE)
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
                        Object.keys(regionKeys).forEach((key) => {
                            regionsAggr[partyChartLabel][key] = 0;
                        });
                    }
                    // aggregate regions from all acounts of the party
                    Object.keys(regionKeys).forEach((key) => {
                        if (pageProps.regions[key] ?? false) {
                            regionsAggr[partyChartLabel][key] +=
                                pageProps.regions[key];
                        }
                    });
                }

                if (loadedCharts.includes(chartKeys.DEMOGRAPHY)) {
                    // create initial objects for party
                    if (!(genderAggr[partyChartLabel] ?? false)) {
                        genderAggr[partyChartLabel] = {};
                    }
                    if (!(ageAggr[partyChartLabel] ?? false)) {
                        ageAggr[partyChartLabel] = {};
                    }
                    // aggregate gender/ages amounts from all acounts of the party
                    Object.entries(pageProps.demography).forEach(
                        ([dKey, dSize]) => {
                            const [gender, age] = dKey.split('|');
                            genderAggr[partyChartLabel][gender] =
                                (genderAggr[partyChartLabel][gender] ?? 0) +
                                dSize;
                            ageAggr[partyChartLabel][age] =
                                (ageAggr[partyChartLabel][age] ?? 0) + dSize;
                        }
                    );
                }

                if (loadedCharts.includes(chartKeys.ATTRIBUTION)) {
                    // create initial object for party
                    if (!(attributionsAggr[partyChartLabel] ?? false)) {
                        attributionsAggr[partyChartLabel] = {};
                        Object.keys(attributionKeys).forEach((key) => {
                            attributionsAggr[partyChartLabel][key] = 0;
                        });
                    }
                    // aggregate attributions from all acounts of the party
                    Object.keys(attributionKeys).forEach((key) => {
                        if (pageProps.attribution.mandatory[key] ?? false) {
                            attributionsAggr[partyChartLabel][key] +=
                                pageProps.attribution.mandatory[key];
                        }
                    });
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
                Object.keys(attributionKeys).forEach((key) => {
                    if (pageProps.attribution.mandatory[key] ?? false) {
                        attributions[key] =
                            (attributions[key] ?? 0) +
                            pageProps.attribution.mandatory[key];
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
                Object.values(partyRegions).forEach((share) => {
                    sum += share;
                });
                Object.entries(partyRegions).forEach(([key, share]) => {
                    dataPoint[key] = share / sum;
                });
                regionsPercentages.push(dataPoint);
            }
        );
        regionsPercentages.sort(sortByName);
        Object.entries(regionOptions).forEach(([key, options]) => {
            regionsBars.push({
                key,
                name: t(labels.ads.meta.regions.regionLabels[key]),
                color: options.color,
                stackId: 'regions',
            });
        });

        Object.entries(genderAggr).forEach(
            ([partyChartLabel, partyGenders]) => {
                const dataPoint = {
                    name: partyChartLabel,
                };
                let sum = 0;
                Object.values(partyGenders).forEach((share) => {
                    sum += share;
                });
                Object.entries(partyGenders).forEach(([key, share]) => {
                    dataPoint[key] = share / sum;
                });
                genderPercentages.push(dataPoint);
            }
        );
        genderPercentages.sort(sortByNumericProp(genderKeys.female));
        Object.entries(genderColors).forEach(([key, color]) => {
            genderBars.push({
                key,
                name: t(labels.ads.meta.demography.genderLabels[key]),
                color,
                stackId: 'genders',
            });
        });

        Object.entries(ageAggr).forEach(([partyChartLabel, partyAges]) => {
            const dataPoint = {
                name: partyChartLabel,
            };
            let sum = 0;
            Object.values(partyAges).forEach((aShare) => {
                sum += aShare;
            });
            Object.entries(partyAges).forEach(([aKey, aShare]) => {
                dataPoint[aKey] = aShare / sum;
            });
            agePercentages.push(dataPoint);
        });
        agePercentages.sort(sortByName);
        Object.entries(ageColors).forEach(([key, color]) => {
            ageBars.push({
                key,
                name: key,
                color,
                stackId: 'ages',
            });
        });

        Object.entries(attributionsAggr).forEach(
            ([partyChartLabel, partyAttr]) => {
                const dataPoint = {
                    name: partyChartLabel,
                };
                let sum = 0;
                Object.values(partyAttr).forEach((amount) => {
                    sum += amount;
                });
                Object.entries(partyAttr).forEach(([key, amount]) => {
                    dataPoint[key] = amount / sum;
                });
                if (sum) {
                    attributionsPercentages.push(dataPoint);
                }
            }
        );
        attributionsPercentages.sort(sortByNumericProp(attributionKeys.YES));
        Object.entries(attributionColors).forEach(([key, color]) => {
            const name = t(labels.ads.meta.attribution.attrLabels[key]);
            if (attributions[key] ?? false) {
                attributionsPie.data.push({
                    name,
                    value: attributions[key],
                    color,
                });
            }
            attributionsBars.push({
                key,
                name,
                color,
                stackId: 'attr',
            });
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
                subtitle={t(labels.ads.meta.spending.partiesDisclaimer)}
                timestamp={sheetsData.lastUpdateFb}
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
                subtitle={t(labels.ads.meta.spending.disclaimer)}
                timestamp={sheetsData.lastUpdateFb}
                vertical
            />
        ) : null,
        [chartKeys.RANGES_PARTIES]: (
            <FbRangesChart
                data={Object.values(partiesAggr).sort(sortByNumericProp('est'))}
                subtitle={t(labels.ads.meta.ranges.disclaimer)}
                timestamp={timestamp}
                vertical
            />
        ),
        [chartKeys.RANGES_ACCOUNTS]: loadedCharts.includes(
            chartKeys.RANGES_ACCOUNTS
        ) ? (
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                subtitle={t(labels.ads.meta.ranges.disclaimer)}
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
                subtitle={t(labels.ads.amount.disclaimer)}
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
                subtitle={t(labels.ads.amount.disclaimer)}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.REGIONS]: loadedCharts.includes(chartKeys.REGIONS) ? (
            <TisBarChart
                bars={regionsBars}
                data={regionsPercentages}
                percent
                subtitle={t(labels.ads.meta.regions.allDisclaimer)}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.DEMOGRAPHY]: loadedCharts.includes(chartKeys.DEMOGRAPHY) ? (
            <Row className="gy-3">
                <Col>
                    <TisBarChart
                        bars={genderBars}
                        data={genderPercentages}
                        percent
                        subtitle={t(
                            labels.ads.meta.demography.gendersDisclaimer
                        )}
                        timestamp={timestamp}
                        title={t(labels.ads.meta.demography.genders)}
                        vertical
                    />
                </Col>
                <Col>
                    <TisBarChart
                        bars={ageBars}
                        data={agePercentages}
                        percent
                        subtitle={t(labels.ads.meta.demography.agesDisclaimer)}
                        timestamp={timestamp}
                        title={t(labels.ads.meta.demography.ages)}
                        vertical
                    />
                </Col>
            </Row>
        ) : null,
        [chartKeys.ATTRIBUTION]: loadedCharts.includes(
            chartKeys.ATTRIBUTION
        ) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        pie={attributionsPie}
                        percent={false}
                        subtitle={t(labels.ads.meta.attribution.disclaimer)}
                        timestamp={timestamp}
                        title={t(labels.ads.meta.attribution.allTitle)}
                    />
                </Col>
                <Col xl={6}>
                    <TisBarChart
                        bars={attributionsBars}
                        data={attributionsPercentages}
                        percent
                        subtitle={t(labels.ads.meta.attribution.pctDisclaimer)}
                        timestamp={timestamp}
                        title={t(labels.ads.meta.attribution.pctTitle)}
                        vertical
                    />
                </Col>
            </Row>
        ) : null,
    };

    const accordions = [
        [chartKeys.SPENDING_PARTIES, labels.ads.meta.spending.partiesTitle],
        [chartKeys.SPENDING_ACCOUNTS, labels.ads.meta.spending.accountsTitle],
        [chartKeys.RANGES_PARTIES, labels.ads.meta.ranges.partiesTitle],
        [chartKeys.RANGES_ACCOUNTS, labels.ads.meta.ranges.accountsTitle],
        [chartKeys.AMOUNTS_PARTIES, labels.ads.amount.partiesTitle],
        [chartKeys.AMOUNTS_ACCOUNTS, labels.ads.amount.accountsTitle],
        [chartKeys.REGIONS, labels.ads.meta.regions.title],
        [chartKeys.DEMOGRAPHY, labels.ads.meta.demography.title],
        [chartKeys.ATTRIBUTION, labels.ads.meta.attribution.title],
    ].map(([key, label]) => (
        <Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{t(label)}</Accordion.Header>
            <Accordion.Body>{charts[key]}</Accordion.Body>
        </Accordion.Item>
    ));

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

    setTitle('Online kampane Meta');

    return (
        <div>
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.ads.meta.disclaimer)}
            </AlertWithIcon>
            <Accordion
                className="mt-4"
                activeKey={activeKeys}
                alwaysOpen
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </div>
    );
}

export default Meta;
