import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {
    attributionDefs,
    genderDefs,
    getColorOpacityScale,
    regionDefs,
} from '../../api/chartHelpers';
import { colors, labels } from '../../api/constants';
import {
    setTitle,
    sortByName,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';

import useAdsData from '../../context/AdsDataContext';

import FbRangesChart from '../../components/charts/FbRangesChart';
import TisBarChart, {
    columnVariants,
} from '../../components/charts/TisBarChart';
import TisPieChart from '../../components/charts/TisPieChart';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';

const chartKeys = {
    SPENDING: labels.ads.spendingPartyAccountsTitle,
    RANGES: labels.ads.rangesPartyAccountsTitle,
    AMOUNTS: labels.ads.amountPartyAccountsTitle,
    REGIONS: labels.ads.regions.title,
    DEMOGRAPHY: labels.ads.demography.title,
    ATTRIBUTION: labels.ads.attribution.title,
};

function PartyOnline() {
    const party = useOutletContext();
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING]);
    const [loadedCharts, setLoadedCharts] = useState([chartKeys.SPENDING]);

    const { metaApiData, sheetsData, mergedWeeksData, findPartyForFbAccount } =
        useAdsData();

    // parse data from sheets
    const spending = [];
    if (sheetsData.lastUpdate) {
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
        label: labels.ads.regions.label,
        innerLabel: labels.ads.regions.sizeLabel,
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
        label: labels.ads.percent,
    };
    const agesPie = {
        data: [],
        color: colors.colorDarkBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: labels.ads.percent,
    };
    const attributions = {};
    const attributionsPie = {
        data: [],
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: labels.ads.attribution.amount,
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
                    Object.entries(regionDefs).forEach(
                        ([regionKey, regionProps]) => {
                            if (pageProps.regions[regionKey] ?? false) {
                                const label = regionProps.name;
                                if (regions[regionKey] ?? false) {
                                    regions[regionKey].value +=
                                        pageProps.regions[regionKey];
                                } else {
                                    regions[regionKey] = {
                                        name: label,
                                        value: pageProps.regions[regionKey],
                                        size: regionProps.size,
                                        color:
                                            regionProps.color ??
                                            colors.colorOrange,
                                    };
                                }
                                const val =
                                    pageProps.regions[regionKey] /
                                    regionProps.size;
                                if (regionsCols[regionKey] ?? false) {
                                    regionsCols[regionKey].value += val;
                                } else {
                                    regionsCols[regionKey] = {
                                        name: label,
                                        value: val,
                                        color:
                                            regionProps.color ??
                                            colors.colorDarkBlue,
                                    };
                                }
                            }
                        }
                    );
                }

                if (loadedCharts.includes(chartKeys.DEMOGRAPHY)) {
                    Object.entries(pageProps.demography).forEach(
                        ([dKey, dSize]) => {
                            const [gender, age] = dKey.split('|');
                            genders[gender] = (genders[gender] ?? 0) + dSize;
                            ages[age] = (ages[age] ?? 0) + dSize;
                        }
                    );
                }

                if (loadedCharts.includes(chartKeys.ATTRIBUTION)) {
                    Object.entries(pageProps.attribution).forEach(
                        ([aKey, aAmount]) => {
                            attributions[aKey] =
                                (attributions[aKey] ?? 0) + aAmount;
                        }
                    );
                }

                timestamp = Math.max(timestamp, pageProps.updated);
            }
        });

        // sort & preprocess aggregated data for charts
        regionsPie.data = Object.values(regions);
        regionsDiffs = Object.values(regionsCols).sort(
            sortByNumericProp('value')
        );
        Object.entries(genderDefs).forEach(([gKey, gProps]) => {
            if (genders[gKey] ?? false) {
                gendersPie.data.push({
                    name: gProps.name ?? gKey,
                    value: genders[gKey],
                    color: gProps.color ?? colors.colorLightBlue,
                });
            }
        });
        Object.entries(ages).forEach(([aKey, aSize]) => {
            agesPie.data.push({
                name: aKey,
                value: aSize,
            });
        });
        agesPie.data.sort(sortByName).forEach((ap, index) => {
            agesPie.data[index].color = `rgb(27, 51, 95, ${getColorOpacityScale(
                index,
                agesPie.data.length
            )})`;
        });
        Object.entries(attributionDefs).forEach(([aKey, aProps]) => {
            if (attributions[aKey] ?? false) {
                attributionsPie.data.push({
                    name: aProps.name ?? aKey,
                    value: attributions[aKey],
                    color: aProps.color ?? colors.colorLightBlue,
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
                disclaimer={labels.ads.spendingDisclaimer}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
        [chartKeys.RANGES]: loadedCharts.includes(chartKeys.RANGES) ? (
            <FbRangesChart
                data={ranges.sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.rangesDisclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS]: loadedCharts.includes(chartKeys.AMOUNTS) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                disclaimer={labels.ads.amountDisclaimer}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.REGIONS]: loadedCharts.includes(chartKeys.REGIONS) ? (
            <Row className="gx-0 gy-3">
                <Col xl={6}>
                    <TisPieChart
                        disclaimer={
                            <>
                                {labels.ads.regions.disclaimer}
                                <br />
                                {labels.ads.regions.sizeDisclaimer}
                            </>
                        }
                        pie={regionsPie}
                        timestamp={timestamp}
                    />
                </Col>
                <Col xl={6}>
                    <TisBarChart
                        barHeight={35}
                        bars={[
                            {
                                key: 'value',
                                name: labels.ads.regions.diffAvg,
                                color: '#000',
                            },
                        ]}
                        data={regionsDiffs}
                        diffFromAverage
                        disclaimer={labels.ads.regions.diffAvgDisclaimer}
                        timestamp={timestamp}
                        vertical
                    />
                </Col>
            </Row>
        ) : null,
        [chartKeys.DEMOGRAPHY]: loadedCharts.includes(chartKeys.DEMOGRAPHY) ? (
            <Row className="gx-0 gy-3">
                <Col xl={6}>
                    <TisPieChart
                        disclaimer={labels.ads.demography.gendersDisclaimer}
                        pie={gendersPie}
                        timestamp={timestamp}
                    />
                </Col>
                <Col xl={6}>
                    <TisPieChart
                        disclaimer={labels.ads.demography.agesDisclaimer}
                        pie={agesPie}
                        timestamp={timestamp}
                    />
                </Col>
            </Row>
        ) : null,
        [chartKeys.ATTRIBUTION]: loadedCharts.includes(
            chartKeys.ATTRIBUTION
        ) ? (
            <Row className="gx-0 gy-3">
                <Col xl={6}>
                    <TisPieChart
                        disclaimer={labels.ads.attribution.disclaimer}
                        pie={attributionsPie}
                        percent={false}
                        timestamp={timestamp}
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

    setTitle(`${party.fullName} : Online`);

    return (
        <div className="subpage">
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
        </div>
    );
}

export default PartyOnline;
