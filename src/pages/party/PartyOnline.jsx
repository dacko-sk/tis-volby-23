import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { regions } from '../../api/chartHelpers';
import { colors, labels } from '../../api/constants';
import { setTitle, sortByNumericProp, sortBySpending } from '../../api/helpers';

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
    REGIONS: labels.ads.regionalTitle,
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
    const pages = [];
    const amounts = [];
    const regionsPies = {};
    const regionsRelPies = {};
    const regionsPie = {
        data: [],
        color: colors.colorOrange,
        nameKey: 'name',
        dataKey: 'value',
        label: labels.ads.regionalLabel,
    };
    const regionsRelPie = {
        data: [],
        color: colors.colorDarkBlue,
        nameKey: 'name',
        dataKey: 'value',
        innerKey: 'size',
        label: labels.ads.regionalRelLabel,
        innerLabel: labels.ads.regionalSizeLabel,
    };
    let timestamp = 0;
    if (metaApiData.lastUpdate) {
        Object.entries(metaApiData.pages).forEach(([pageId, pageProps]) => {
            const accountParty = findPartyForFbAccount(pageId);
            if (party.fbName === accountParty) {
                if (loadedCharts.includes(chartKeys.RANGES)) {
                    pages.push({
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
                    Object.entries(regions).forEach(
                        ([regionKey, regionProps]) => {
                            if (pageProps.regions[regionKey] ?? false) {
                                const label = regionProps.name ?? regionKey;
                                if (regionsPies[regionKey] ?? false) {
                                    regionsPies[regionKey].value +=
                                        pageProps.regions[regionKey];
                                } else {
                                    regionsPies[regionKey] = {
                                        name: label,
                                        value: pageProps.regions[regionKey],
                                        color:
                                            regionProps.color ??
                                            colors.colorOrange,
                                    };
                                }
                                if (regionProps.size ?? false) {
                                    const val =
                                        pageProps.regions[regionKey] /
                                        regionProps.size;
                                    if (regionsRelPies[regionKey] ?? false) {
                                        regionsRelPies[regionKey].value += val;
                                    } else {
                                        regionsRelPies[regionKey] = {
                                            name: label,
                                            value: val,
                                            size: regionProps.size,
                                            color:
                                                regionProps.color ??
                                                colors.colorDarkBlue,
                                        };
                                    }
                                }
                            }
                        }
                    );
                }
                timestamp = Math.max(timestamp, pageProps.updated);
            }
        });
        regionsPie.data = Object.values(regionsPies);
        regionsRelPie.data = Object.values(regionsRelPies);
    }

    const charts = {
        [chartKeys.SPENDING]: loadedCharts.includes(chartKeys.SPENDING) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={spending.sort(sortBySpending)}
                disclaimer={labels.ads.spendingDisclaimer}
                namesLength={40}
                timestamp={sheetsData.lastUpdate}
                vertical
            />
        ) : null,
        [chartKeys.RANGES]: loadedCharts.includes(chartKeys.RANGES) ? (
            <FbRangesChart
                data={pages.sort(sortByNumericProp('est'))}
                disclaimer={labels.ads.rangesDisclaimer}
                namesLength={40}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS]: loadedCharts.includes(chartKeys.AMOUNTS) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts.sort(sortByNumericProp('num'))}
                disclaimer={labels.ads.amountDisclaimer}
                namesLength={40}
                timestamp={timestamp}
                vertical
            />
        ) : null,
        [chartKeys.REGIONS]: loadedCharts.includes(chartKeys.REGIONS) ? (
            <Row className="gx-0 gy-3">
                <Col xl={6}>
                    <TisPieChart
                        pie={regionsPie}
                        disclaimer={labels.ads.regionalDisclaimer}
                        timestamp={timestamp}
                    />
                </Col>
                <Col xl={6}>
                    <TisPieChart
                        pie={regionsRelPie}
                        disclaimer={labels.ads.regionalRelDisclaimer}
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
