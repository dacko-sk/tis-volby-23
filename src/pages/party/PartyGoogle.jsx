import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { formatDefs } from '../../api/chartHelpers';
import { labels } from '../../api/constants';
import {
    fixNumber,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';

import TisBarChart, {
    columnVariants,
} from '../../components/charts/TisBarChart';
import TisPieChart from '../../components/charts/TisPieChart';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';

const chartKeys = {
    SPENDING: labels.ads.google.spending.partyAccountsTitle,
    AMOUNTS: labels.ads.amount.partyAccountsTitle,
    FORMATS: labels.ads.google.format.title,
};

function PartyGoogle() {
    const party = useOutletContext();
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING]);
    const [loadedCharts, setLoadedCharts] = useState([chartKeys.SPENDING]);

    const { findPartyForGoogleAccount, sheetsData } = useAdsData();

    // parse data from sheets
    const spendingAccounts = {};
    const amountsAccounts = {};
    const formatAggr = {};
    const formatPie = {
        data: [],
        nameKey: 'name',
        dataKey: 'value',
        label: labels.charts.outgoing,
    };
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const parentPartyName = findPartyForGoogleAccount(
                pageData[sheetsConfig.GOOGLE.columns.ID]
            );
            // only continue if the account belongs to the currently viewed party
            if (party.fbName === parentPartyName) {
                const accountName =
                    pageData[sheetsConfig.GOOGLE.columns.PAGE_NAME] ?? null;
                const outgoing = fixNumber(
                    pageData[sheetsConfig.GOOGLE.columns.SPENDING]
                );
                const num = fixNumber(
                    pageData[sheetsConfig.GOOGLE.columns.AMOUNT]
                );

                // single profiles charts
                if (spendingAccounts[accountName] ?? false) {
                    spendingAccounts[accountName].outgoing += outgoing;
                } else {
                    spendingAccounts[accountName] = {
                        name: accountName,
                        outgoing,
                    };
                }

                if (loadedCharts.includes(chartKeys.AMOUNTS)) {
                    if (amountsAccounts[accountName] ?? false) {
                        amountsAccounts[accountName].num += num;
                    } else {
                        amountsAccounts[accountName] = {
                            name: accountName,
                            num,
                        };
                    }
                }

                if (loadedCharts.includes(chartKeys.FORMATS)) {
                    Object.keys(formatDefs).forEach((fKey) => {
                        if (pageData[fKey] ?? false) {
                            formatAggr[fKey] =
                                (formatAggr[fKey] ?? 0) +
                                fixNumber(pageData[fKey]);
                        }
                    });
                }
            }
        });
    }

    // sort & preprocess aggregated data for charts
    const spending = Object.values(spendingAccounts).sort(sortBySpending);
    const amounts = Object.values(amountsAccounts).sort(
        sortByNumericProp('num')
    );
    Object.entries(formatAggr).forEach(([fKey, value]) => {
        formatPie.data.push({
            name: fKey,
            value,
            color: formatDefs[fKey],
        });
    });

    const charts = {
        [chartKeys.SPENDING]: loadedCharts.includes(chartKeys.SPENDING) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={spending}
                subtitle={labels.ads.google.spending.disclaimer}
                timestamp={sheetsData.lastUpdateGgl}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS]: loadedCharts.includes(chartKeys.AMOUNTS) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts}
                subtitle={labels.ads.amount.disclaimer}
                timestamp={sheetsData.lastUpdateGgl}
                vertical
            />
        ) : null,
        [chartKeys.FORMATS]: loadedCharts.includes(chartKeys.FORMATS) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        currency
                        pie={formatPie}
                        percent={false}
                        subtitle={labels.ads.google.format.disclaimer}
                        timestamp={sheetsData.lastUpdateGgl}
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
    if (!sheetsData.lastUpdateGgl || sheetsData.error) {
        // waiting for data or error in loding
        content = <Loading error={sheetsData.error} />;
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
                {labels.ads.noData}
            </AlertWithIcon>
        );
    }

    return (
        <div className="ads-provider">
            <AlertWithIcon className="my-4" variant="primary">
                {labels.ads.google.disclaimer}
            </AlertWithIcon>
            {content}
        </div>
    );
}

export default PartyGoogle;
