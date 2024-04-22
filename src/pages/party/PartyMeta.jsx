import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {
    ageColors,
    attributionColors,
    attributionKeys,
    genderColors,
    regionOptions,
} from '../../api/chartHelpers';
import { colors } from '../../api/constants';
import { labels, t } from '../../api/dictionary';
import { sortByNumericProp, sortBySpending } from '../../api/helpers';

import useAdsData from '../../context/AdsDataContext';

import FbRangesChart from '../../components/charts/FbRangesChart';
import TisBarChart, {
    columnVariants,
} from '../../components/charts/TisBarChart';
import TisPieChart from '../../components/charts/TisPieChart';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';

function PartyMeta({
    chartKeys = {
        SPENDING: 'SPENDING',
        RANGES: 'RANGES',
        AMOUNTS: 'AMOUNTS',
        REGIONS: 'REGIONS',
        DEMOGRAPHY: 'DEMOGRAPHY',
        ATTRIBUTION: 'ATTRIBUTION',
    },
}) {
    const party = useOutletContext();
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING]);
    const [loadedCharts, setLoadedCharts] = useState([chartKeys.SPENDING]);

    const { findPartyForFbAccount, mergedWeeksData, metaApiData, sheetsData } =
        useAdsData();

    // parse data from sheets
    const spending = [];
    if (sheetsData.lastUpdateFb) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            const accountParty = findPartyForFbAccount(pageId);
            if (party.fbName === accountParty) {
                spending.push(pageProps);
            }
        });
    }

    // parse data from API
    const ranges = [];
    const amounts = [];
    const regions = {};
    const regionsPie = {
        data: [],
        color: colors.colorOrange,
        nameKey: 'name',
        dataKey: 'value',
        innerKey: 'size',
        label: t(labels.ads.meta.regions.label),
        innerLabel: t(labels.ads.meta.regions.sizeLabel),
    };
    const regionsCols = {};
    let regionsDiffs = [];
    const genders = {};
    const ages = {};
    const gendersPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.ads.percent),
    };
    const agesPie = {
        data: [],
        color: colors.colorDarkBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.ads.percent),
    };
    const attributions = {};
    const attrOptional = {};
    const attributionsPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.ads.meta.attribution.amount),
    };
    const attrOptionalPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.ads.meta.attribution.amount),
    };
    let timestamp = 0;

    if (metaApiData.lastUpdate) {
        // collect data from all FB accounts of the party
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const accountParty = findPartyForFbAccount(pageId);
            if (party.fbName === accountParty) {
                if (loadedCharts.includes(chartKeys.RANGES)) {
                    ranges.push({
                        id: pageId,
                        name: pageProps.name,
                        range: [pageProps.spend.min, pageProps.spend.max],
                        est: pageProps.spend.est,
                    });
                }

                if (loadedCharts.includes(chartKeys.AMOUNTS)) {
                    amounts.push({
                        id: pageId,
                        name: pageProps.name,
                        num: pageProps.spend.num,
                    });
                }

                if (loadedCharts.includes(chartKeys.REGIONS)) {
                    Object.entries(regionOptions).forEach(([key, options]) => {
                        if (pageProps.regions[key] ?? false) {
                            const name = t(
                                labels.ads.meta.regions.regionLabels[key]
                            );
                            if (regions[key] ?? false) {
                                regions[key].value += pageProps.regions[key];
                            } else {
                                regions[key] = {
                                    name,
                                    value: pageProps.regions[key],
                                    size: options.size,
                                    color: options.color ?? colors.colorOrange,
                                };
                            }
                            const val = pageProps.regions[key] / options.size;
                            if (regionsCols[key] ?? false) {
                                regionsCols[key].value += val;
                            } else {
                                regionsCols[key] = {
                                    name,
                                    value: val,
                                    color:
                                        options.color ?? colors.colorDarkBlue,
                                };
                            }
                        }
                    });
                }

                if (loadedCharts.includes(chartKeys.DEMOGRAPHY)) {
                    Object.entries(pageProps.demography).forEach(
                        ([key, size]) => {
                            const [gender, age] = key.split('|');
                            genders[gender] = (genders[gender] ?? 0) + size;
                            ages[age] = (ages[age] ?? 0) + size;
                        }
                    );
                }

                if (loadedCharts.includes(chartKeys.ATTRIBUTION)) {
                    Object.keys(attributionKeys).forEach((key) => {
                        if (pageProps.attribution.mandatory[key] ?? false) {
                            attributions[key] =
                                (attributions[key] ?? 0) +
                                pageProps.attribution.mandatory[key];
                        }
                        if (pageProps.attribution.optional[key] ?? false) {
                            attrOptional[key] =
                                (attrOptional[key] ?? 0) +
                                pageProps.attribution.optional[key];
                        }
                    });
                }

                timestamp = Math.max(timestamp, pageProps.updated);
            }
        });

        // sort & preprocess aggregated data for charts
        regionsPie.data = Object.values(regions);
        regionsDiffs = Object.values(regionsCols).sort(
            sortByNumericProp('value')
        );

        Object.entries(genderColors).forEach(([key, color]) => {
            if (genders[key] ?? false) {
                gendersPie.data.push({
                    name: t(labels.ads.meta.demography.genderLabels[key]),
                    value: genders[key],
                    color,
                });
            }
        });

        Object.entries(ageColors).forEach(([key, color]) => {
            if (ages[key] ?? false) {
                agesPie.data.push({
                    name: key,
                    value: ages[key],
                    color,
                });
            }
        });

        Object.entries(attributionColors).forEach(([key, color]) => {
            const name = t(labels.ads.meta.attribution.attrLabels[key]);
            if (attributions[key] ?? false) {
                attributionsPie.data.push({
                    name,
                    value: attributions[key],
                    color,
                });
            }
            if (attrOptional[key] ?? false) {
                attrOptionalPie.data.push({
                    name,
                    value: attrOptional[key],
                    color,
                });
            }
        });
    }

    const charts = {
        [chartKeys.SPENDING]: loadedCharts.includes(chartKeys.SPENDING) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={spending.sort(sortBySpending)}
                timestamp={sheetsData.lastUpdateFb}
                subtitle={t(labels.ads.meta.spending.disclaimer)}
                vertical
            />
        ) : null,
        [chartKeys.RANGES]: loadedCharts.includes(chartKeys.RANGES) ? (
            <FbRangesChart
                data={ranges.sort(sortByNumericProp('est'))}
                timestamp={timestamp}
                subtitle={t(labels.ads.meta.ranges.disclaimer)}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS]: loadedCharts.includes(chartKeys.AMOUNTS) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                timestamp={timestamp}
                subtitle={t(labels.ads.amount.disclaimer)}
                vertical
            />
        ) : null,
        [chartKeys.REGIONS]: loadedCharts.includes(chartKeys.REGIONS) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        pie={regionsPie}
                        subtitle={t(labels.ads.meta.regions.disclaimer)}
                        timestamp={timestamp}
                    />
                </Col>
                <Col xl={6}>
                    <TisBarChart
                        barHeight={32}
                        bars={[
                            {
                                key: 'value',
                                name: labels.ads.meta.regions.diffAvg,
                                color: '#000',
                            },
                        ]}
                        data={regionsDiffs}
                        diffFromAverage
                        subtitle={t(labels.ads.meta.regions.diffAvgDisclaimer)}
                        timestamp={timestamp}
                        vertical
                    />
                </Col>
            </Row>
        ) : null,
        [chartKeys.DEMOGRAPHY]: loadedCharts.includes(chartKeys.DEMOGRAPHY) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        pie={gendersPie}
                        timestamp={timestamp}
                        subtitle={t(
                            labels.ads.meta.demography.gendersDisclaimer
                        )}
                        title={t(labels.ads.meta.demography.genders)}
                    />
                </Col>
                <Col xl={6}>
                    <TisPieChart
                        pie={agesPie}
                        subtitle={t(labels.ads.meta.demography.agesDisclaimer)}
                        timestamp={timestamp}
                        title={t(labels.ads.meta.demography.ages)}
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
                        // title={t(labels.ads.meta.attribution.campaign)}
                    />
                </Col>
            </Row>
        ) : null,
    };

    const accordions = [
        [chartKeys.SPENDING, labels.ads.meta.spending.partyAccountsTitle],
        [chartKeys.RANGES, labels.ads.meta.ranges.partyAccountsTitle],
        [chartKeys.AMOUNTS, labels.ads.amount.partyAccountsTitle],
        [chartKeys.REGIONS, labels.ads.meta.regions.title],
        [chartKeys.DEMOGRAPHY, labels.ads.meta.demography.title],
        [chartKeys.ATTRIBUTION, labels.ads.meta.attribution.title],
    ].map(([key, label]) => (
        <Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{t(label)}</Accordion.Header>
            <Accordion.Body>{charts[key]}</Accordion.Body>
        </Accordion.Item>
    ));

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

    let content = null;
    if (!metaApiData.lastUpdate || metaApiData.error) {
        // waiting for data or error in loding
        content = <Loading error={metaApiData.error} />;
    } else if (spending.length) {
        content = (
            <Accordion
                className="mt-4"
                activeKey={activeKeys}
                alwaysOpen
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        );
    } else {
        content = (
            <AlertWithIcon className="my-4" variant="danger">
                {t(labels.ads.noData)}
            </AlertWithIcon>
        );
    }

    return (
        <div className="ads-provider">
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.ads.meta.disclaimer)}
            </AlertWithIcon>
            {content}
        </div>
    );
}

export default PartyMeta;
