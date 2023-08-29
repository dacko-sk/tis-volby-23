import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link, useOutletContext } from 'react-router-dom';
import has from 'has';

import { colors, labels } from '../../api/constants';
import {
    currencyFormat,
    fixNumber,
    isNumeric,
    setTitle,
} from '../../api/helpers';
import { routes, segments } from '../../api/routes';
import { wpCat } from '../../api/wpHelpers';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';

// import AccountTransactions from '../../components/accounts/AccountTransactions';
import LastUpdateTag from '../../components/general/LastUpdateTag';
import Posts, { templates } from '../../components/wp/Posts';
import TisBarChart from '../../components/charts/TisBarChart';

function PartyTransactions() {
    const party = useOutletContext();

    const {
        findPartyForFbAccount,
        findPartyForGoogleAccount,
        mergedWeeksData,
        sheetsData,
    } = useAdsData();

    setTitle(party.fullName);

    // add FB totals from precampaing & all weeks (sheets) of campaing
    let totalMeta = 0;
    Object.entries(mergedWeeksData).forEach(([pageId, pageData]) => {
        const accountParty = findPartyForFbAccount(pageId);
        if (party.fbName === accountParty && isNumeric(pageData.outgoing)) {
            totalMeta += pageData.outgoing;
        }
    });

    // add google totals
    let totalGoogle = 0;
    sheetsData.googleAds.forEach((pageData) => {
        const accountParty = findPartyForGoogleAccount(
            pageData[sheetsConfig.GOOGLE.columns.ID]
        );
        if (party.fbName === accountParty) {
            totalGoogle += fixNumber(
                pageData[sheetsConfig.GOOGLE.columns.SPENDING]
            );
        }
    });

    return (
        <div className="subpage">
            <Row className="my-4">
                <Col lg={6}>
                    <TisBarChart
                        bars={[
                            {
                                key: 'outgoing',
                                name: labels.charts.outgoing,
                                color: colors.colorOrange,
                                stackId: 'finance',
                            },
                            {
                                key: 'incoming',
                                name: labels.charts.incoming,
                                color: colors.colorDarkBlue,
                                stackId: 'finance',
                            },
                        ]}
                        data={[
                            {
                                name: labels.charts.outgoing,
                                outgoing: party.sum_outgoing,
                            },
                            {
                                name: labels.charts.incoming,
                                incoming: party.sum_incoming,
                            },
                        ]}
                        buttonLink={routes.charts}
                        currency
                        lastUpdate={false}
                    />
                </Col>
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-4">Priebežné výdavky strany</h2>
                        <p className="hero-number">
                            {currencyFormat(party.sum_outgoing)}
                            <LastUpdateTag timestamp={party.timestamp} />
                        </p>
                    </div>

                    <div className="buttons mt-4">
                        <Button
                            as={Link}
                            to={routes.party(party.slug, segments.TRANSACTIONS)}
                            variant="secondary"
                        >
                            Zobraziť všetky transakcie
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="my-4">
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-3">
                            {labels.ads.meta.totalSpendingTitle}
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(totalMeta)}
                            <LastUpdateTag
                                timestamp={sheetsData.lastUpdateFb || null}
                            >
                                {labels.ads.meta.totalDisclaimer}
                            </LastUpdateTag>
                        </p>
                    </div>
                </Col>
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-3">
                            {labels.ads.google.totalSpendingTitle}
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(totalGoogle)}
                            <LastUpdateTag
                                timestamp={sheetsData.lastUpdateFb || null}
                            >
                                {labels.ads.google.totalDisclaimer}
                            </LastUpdateTag>
                        </p>
                    </div>
                </Col>
            </Row>

            <div className="buttons my-4 text-center">
                <Button
                    as={Link}
                    to={routes.party(party.slug, segments.ONLINE)}
                    variant="secondary"
                >
                    {labels.ads.showMore}
                </Button>
            </div>

            {has(party, 'tag') && (
                <>
                    <h2 className="mt-4">Najnovšie aktuality</h2>
                    <Posts
                        categories={[wpCat.news]}
                        limit={2}
                        showMoreLink={routes.party(party.slug, segments.NEWS)}
                        tags={[party.tag]}
                        template={templates.condensed}
                    />
                </>
            )}
        </div>
    );
}

export default PartyTransactions;
