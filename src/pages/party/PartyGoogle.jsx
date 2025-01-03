import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../api/dictionary';
import {
    fixNumber,
    sortByNumericProp,
    sortBySpending,
} from '../../api/helpers';
import { formatDefs } from '../../api/online';

import useAdsData, { csvConfig, csvFiles } from '../../context/AdsDataContext';

import TisBarChart, {
    columnVariants,
} from '../../components/charts/TisBarChart';
import TisPieChart from '../../components/charts/TisPieChart';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';

const chartKeys = {
    SPENDING: 'SPENDING',
    AMOUNTS: 'AMOUNTS',
    FORMATS: 'FORMATS',
};

function PartyGoogle({ googleColumns = csvConfig[csvFiles.GOOGLE].columns }) {
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
        label: t(labels.charts.outgoing),
    };
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const parentPartyName = findPartyForGoogleAccount(
                pageData[googleColumns.ID]
            );
            // only continue if the account belongs to the currently viewed party
            if (party.fbName === parentPartyName) {
                const accountName = pageData[googleColumns.PAGE_NAME] ?? null;
                const outgoing = fixNumber(pageData[googleColumns.SPENDING]);
                const num = fixNumber(pageData[googleColumns.AMOUNT]);

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
                subtitle={t(labels.ads.google.spending.disclaimer)}
                timestamp={sheetsData.lastUpdateGgl}
                vertical
            />
        ) : null,
        [chartKeys.AMOUNTS]: loadedCharts.includes(chartKeys.AMOUNTS) ? (
            <TisBarChart
                bars={columnVariants.amount}
                data={amounts}
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
        [chartKeys.SPENDING, labels.ads.google.spending.partyAccountsTitle],
        [chartKeys.AMOUNTS, labels.ads.amount.partyAccountsTitle],
        [chartKeys.FORMATS, labels.ads.google.format.title],
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
                {t(labels.ads.noData)}
            </AlertWithIcon>
        );
    }

    return (
        <div className="ads-provider">
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.ads.google.disclaimer)}
            </AlertWithIcon>
            {content}
        </div>
    );
}

export default PartyGoogle;
