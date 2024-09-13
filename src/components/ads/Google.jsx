import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../api/browserHelpers';
import { getPartyChartLabel } from '../../api/chartHelpers';
import { labels, t } from '../../api/dictionary';
import {
    fixNumber,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';
import { formatDefs } from '../../api/online';
import { segments } from '../../api/routes';

import useAdsData, { csvConfig, csvFiles } from '../../context/AdsDataContext';
import useCsvData from '../../context/DataContext';

import TisBarChart, { columnVariants } from '../charts/TisBarChart';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import TisPieChart from '../charts/TisPieChart';

function Google({
    chartKeys = {
        SPENDING_PARTIES: 'SPENDING_PARTIES',
        SPENDING_ACCOUNTS: 'SPENDING_ACCOUNTS',
        AMOUNTS_PARTIES: 'AMOUNTS_PARTIES',
        AMOUNTS_ACCOUNTS: 'AMOUNTS_ACCOUNTS',
        FORMATS: 'FORMATS',
    },
    googleColumns = csvConfig[csvFiles.GOOGLE].columns,
}) {
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
                pageData[googleColumns.ID]
            );
            const accountName = pageData[googleColumns.PAGE_NAME] ?? null;
            const party = findPartyByFbName(parentPartyName);
            const partyChartLabel = party
                ? getPartyChartLabel(party, segments.ONLINE)
                : parentPartyName;
            const outgoing = fixNumber(pageData[googleColumns.SPENDING]);
            const num = fixNumber(pageData[googleColumns.AMOUNT]);

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
                subtitle={t(labels.ads.google.spending.partiesDisclaimer)}
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
                subtitle={t(labels.ads.google.spending.disclaimer)}
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
                subtitle={t(labels.ads.amount.disclaimer)}
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
                subtitle={t(labels.ads.amount.disclaimer)}
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
                        subtitle={t(labels.ads.google.format.disclaimer)}
                        timestamp={sheetsData.lastUpdateGgl}
                    />
                </Col>
            </Row>
        ) : null,
    };

    const accordions = [
        [chartKeys.SPENDING_PARTIES, labels.ads.google.spending.partiesTitle],
        [chartKeys.SPENDING_ACCOUNTS, labels.ads.google.spending.accountsTitle],
        [chartKeys.AMOUNTS_PARTIES, labels.ads.amount.partiesTitle],
        [chartKeys.AMOUNTS_ACCOUNTS, labels.ads.amount.accountsTitle],
        [chartKeys.FORMATS, labels.ads.google.format.title],
    ].map(([key, label]) => (
        <Accordion.Item key={key} eventKey={key}>
            <Accordion.Header>{t(label)}</Accordion.Header>
            <Accordion.Body>{charts[key]}</Accordion.Body>
        </Accordion.Item>
    ));

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
                {t(labels.ads.google.disclaimer)}
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
