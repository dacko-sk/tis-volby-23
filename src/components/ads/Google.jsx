import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import { getPartyChartLabel } from '../../api/chartHelpers';
import { labels } from '../../api/constants';
import {
    getTimestampFromDate,
    setTitle,
    sortBySpending,
} from '../../api/helpers';
import { segments } from '../../api/routes';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';
import useCsvData from '../../context/DataContext';

import TisBarChart, { columnVariants } from '../charts/TisBarChart';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
// import TisPieChart from '../charts/TisPieChart';

const chartKeys = {
    SPENDING_PARTIES: labels.ads.google.spending.partiesTitle,
    SPENDING_ACCOUNTS: labels.ads.google.spending.accountsTitle,
};

function Google() {
    const [activeKeys, setActiveKeys] = useState([chartKeys.SPENDING_PARTIES]);
    const [loadedCharts, setLoadedCharts] = useState([
        chartKeys.SPENDING_PARTIES,
    ]);

    const { findPartyForGoogleAccount, sheetsData } = useAdsData();
    const { findPartyByFbName } = useCsvData();

    // parse data from sheets
    let googleLastUpdate = 0;
    const spending = [];
    const spendingAggr = {};
    const spendingAccounts = {};
    if (sheetsData.lastUpdate) {
        sheetsData.googleAds.forEach((pageData) => {
            const parentPartyName = findPartyForGoogleAccount(
                pageData[sheetsConfig.GOOGLE.columns.ID]
            );
            const accountName =
                pageData[sheetsConfig.GOOGLE.columns.PAGE_NAME] ?? null;
            const party = findPartyByFbName(parentPartyName);
            const outgoing = Number(
                pageData[sheetsConfig.GOOGLE.columns.SPENDING]
            );
            if (parentPartyName) {
                if (spendingAggr[parentPartyName] ?? false) {
                    spendingAggr[parentPartyName].outgoing += outgoing;
                } else {
                    spendingAggr[parentPartyName] = {
                        name: party
                            ? getPartyChartLabel(party, segments.ONLINE)
                            : parentPartyName,
                        outgoing,
                    };
                }
            }

            if (loadedCharts.includes(chartKeys.SPENDING_ACCOUNTS)) {
                spending.push({
                    name: accountName,
                    outgoing,
                });
                if (spendingAccounts[accountName] ?? false) {
                    spendingAccounts[accountName].outgoing += outgoing;
                } else {
                    spendingAccounts[accountName] = {
                        name: accountName,
                        outgoing,
                    };
                }
            }

            googleLastUpdate = Math.max(
                googleLastUpdate,
                getTimestampFromDate(
                    pageData[sheetsConfig.GOOGLE.columns.UPDATED]
                )
            );
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
                subtitle={labels.ads.google.spending.partiesDisclaimer}
                timestamp={googleLastUpdate}
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
                timestamp={googleLastUpdate}
                vertical
            />
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

    if (!sheetsData.lastUpdate || sheetsData.error) {
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
