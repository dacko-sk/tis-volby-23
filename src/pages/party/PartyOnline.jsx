import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { colors, labels, regions } from '../../api/constants';
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
    let pie = null;
    let relativePie = null;
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
                    const pies = [];
                    const relativePies = [];
                    Object.entries(pageProps.regions).forEach(
                        ([name, value]) => {
                            let label = regions[name].name ?? name;
                            if (window.innerWidth < 576) {
                                // shorter labels on mobile
                                label = label.replace(' kraj', '');
                            }
                            pies.push({
                                name: label,
                                value,
                            });
                            if (regions[name].size ?? false) {
                                relativePies.push({
                                    name: label,
                                    value: value / regions[name].size,
                                });
                            }
                        }
                    );
                    pie = {
                        data: pies.sort(sortByNumericProp('value')),
                        color: colors.colorOrange,
                        name: 'name',
                        key: 'value',
                    };
                    relativePie = {
                        data: relativePies.sort(sortByNumericProp('value')),
                        color: colors.colorDarkBlue,
                        name: 'name',
                        key: 'value',
                    };
                }
                timestamp = Math.max(timestamp, pageProps.updated);
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
                        pie={pie}
                        disclaimer={labels.ads.regionalDisclaimer}
                        timestamp={timestamp}
                    />
                </Col>
                <Col xl={6}>
                    <TisPieChart
                        pie={relativePie}
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
