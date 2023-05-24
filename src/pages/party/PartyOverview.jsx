import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link, useOutletContext } from 'react-router-dom';
import has from 'has';

import { colors, labels } from '../../api/constants';
import { currencyFormat, dateFormat, setTitle } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

import useAdsData from '../../context/AdsDataContext';

// import AccountTransactions from '../../components/accounts/AccountTransactions';
import LastUpdateTag from '../../components/general/LastUpdateTag';
import Posts, { templates } from '../../components/wp/Posts';
import TisBarChart from '../../components/charts/TisBarChart';

import { newsCategories } from '../News';

function PartyTransactions() {
    const party = useOutletContext();

    const { sheetsData, findPartyForFbAccount } = useAdsData();

    setTitle(party.fullName);

    const weeks = [];
    let allWeeks = 0;
    Object.entries(sheetsData.weeks).forEach(([timestamp, weekData]) => {
        let weekSpent = 0;
        weekData.forEach((pageData) => {
            const accountParty = findPartyForFbAccount(pageData['Page ID']);
            if (
                party.fbName === accountParty &&
                !Number.isNaN(pageData['Amount spent (EUR)'])
            ) {
                weekSpent += Number(pageData['Amount spent (EUR)']);
            }
        });
        weeks.push({
            name: dateFormat(timestamp),
            outgoing: weekSpent,
        });
        allWeeks += weekSpent;
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
                <Col lg={6}>
                    <TisBarChart
                        bars={[
                            {
                                key: 'outgoing',
                                name: labels.ads.weeklySpending,
                                color: colors.colorLightBlue,
                            },
                        ]}
                        currency
                        data={weeks}
                        lastUpdate={false}
                    />
                </Col>
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-3">
                            Priebežné výdavky na online
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(allWeeks)}
                            <LastUpdateTag
                                timestamp={sheetsData.lastUpdate || null}
                            >
                                {labels.ads.totalDisclaimer}
                            </LastUpdateTag>
                        </p>
                    </div>

                    <div className="buttons mt-4">
                        <Button
                            as={Link}
                            to={routes.party(party.slug, segments.ONLINE)}
                            variant="secondary"
                        >
                            {labels.ads.showMore}
                        </Button>
                    </div>
                </Col>
            </Row>

            {has(party, 'tag') && (
                <>
                    <h2 className="mt-4">Najnovšie aktuality</h2>
                    <Posts
                        categories={newsCategories}
                        limit={2}
                        section={segments.NEWS}
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
