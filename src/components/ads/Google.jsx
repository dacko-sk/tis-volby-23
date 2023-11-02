import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { formatDefs, getPartyChartLabel } from '../../api/chartHelpers';
import { labels, t } from '../../api/dictionary';
import {
    fixNumber,
    setTitle,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';
import { segments } from '../../api/routes';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';
import useCsvData from '../../context/DataContext';

import TisBarChart, { columnVariants } from '../charts/TisBarChart';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import TisPieChart from '../charts/TisPieChart';

const chartKeys = {
    SPENDING_PARTIES: labels.ads.google.spending.partiesTitle,
    SPENDING_ACCOUNTS: labels.ads.google.spending.accountsTitle,
    AMOUNTS_PARTIES: labels.ads.amount.partiesTitle,
    AMOUNTS_ACCOUNTS: labels.ads.amount.accountsTitle,
    FORMATS: labels.ads.google.format.title,
};

function Google() {
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING_PARTIES]);
    const [loadedCharts, setLoadedCharts] = useState([
        chartKeys.SPENDING_PARTIES,
    ]);

    const { findPartyForGoogleAccount, sheetsData } = useAdsData();
    const { findPartyByFbName } = useCsvData();

    // parse data from sheets
    const spendingAggr = {};
    const spendingAccounts = {};
    const amountsAggr = {};
    const amountsAccounts = {};
    const formatAggr = {};
    const formatPie = {
        data: [],
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.charts.outgoing),
    };
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const parentPartyName = findPartyForGoogleAccount(
                pageData[sheetsConfig.GOOGLE.columns.ID]
            );
            const accountName =
                pageData[sheetsConfig.GOOGLE.columns.PAGE_NAME] ?? null;
            const party = findPartyByFbName(parentPartyName);
            const partyChartLabel = party
                ? getPartyChartLabel(party, segments.ONLINE)
                : parentPartyName;
            const outgoing = fixNumber(
                pageData[sheetsConfig.GOOGLE.columns.SPENDING]
            );
            const num = fixNumber(pageData[sheetsConfig.GOOGLE.columns.AMOUNT]);

            // aggregated party charts
            if (parentPartyName) {
                if (spendingAggr[parentPartyName] ?? false) {
                    spendingAggr[parentPartyName].outgoing += outgoing;
                } else {
                    spendingAggr[parentPartyName] = {
                        name: partyChartLabel,
                        outgoing,
                    };
                }

                if (loadedCharts.includes(chartKeys.AMOUNTS_PARTIES)) {
                    if (amountsAggr[parentPartyName] ?? false) {
                        amountsAggr[parentPartyName].num += num;
                    } else {
                        amountsAggr[parentPartyName] = {
                            name: partyChartLabel,
                            num,
                        };
                    }
                }
            }

            // single profiles charts
            if (loadedCharts.includes(chartKeys.SPENDING_ACCOUNTS)) {
                if (spendingAccounts[accountName] ?? false) {
                    spendingAccounts[accountName].outgoing += outgoing;
                } else {
                    spendingAccounts[accountName] = {
                        name: accountName,
                        outgoing,
                    };
                }
            }

            if (loadedCharts.includes(chartKeys.AMOUNTS_ACCOUNTS)) {
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
                            (formatAggr[fKey] ?? 0) + fixNumber(pageData[fKey]);
                    }
                });
            }
        });
    }

    // sort & preprocess aggregated data for charts
    Object.entries(formatAggr).forEach(([fKey, value]) => {
        formatPie.data.push({
            name: fKey,
            value,
            color: formatDefs[fKey],
        });
    });

    const charts = {
        [chartKeys.SPENDING_PARTIES]: loadedCharts.includes(
            chartKeys.SPENDING_PARTIES
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={Object.values(spendingAggr).sort(sortBySpending)}
                subtitle={labels.ads.google.spending.partiesDisclaimer}
                timestamp={sheetsData.lastUpdateGgl}
                vertical
            />
        ) : null,
        [chartKeys.SPENDING_ACCOUNTS]: loadedCharts.includes(
            chartKeys.SPENDING_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.spending}
                currency
                data={Object.values(spendingAccounts).sort(sortBySpending)}
                subtitle={labels.ads.google.spending.disclaimer}
                timestamp={sheetsData.lastUpdateGgl}
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
                timestamp={sheetsData.lastUpdateGgl}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS_ACCOUNTS]: loadedCharts.includes(
            chartKeys.AMOUNTS_ACCOUNTS
        ) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={Object.values(amountsAccounts).sort(
                    sortByNumericProp('num')
                )}
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

    if (!sheetsData.lastUpdateGgl || sheetsData.error) {
        // waiting for data or error in loding
        return <Loading error={sheetsData.error} />;
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

    setTitle('Online kampane Google');

    return (
        <div>
            <AlertWithIcon className="my-4" variant="primary">
                {labels.ads.google.disclaimer}
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

export default Google;
