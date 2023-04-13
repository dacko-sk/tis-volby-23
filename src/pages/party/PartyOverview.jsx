import Button from 'react-bootstrap/Button';
import { Link, useOutletContext } from 'react-router-dom';
import has from 'has';

import { colors, labels } from '../../api/constants';
import { currencyFormat, setTitle } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

// import AccountTransactions from '../../components/accounts/AccountTransactions';
import LastUpdateTag from '../../components/accounts/LastUpdateTag';
import Posts, { templates } from '../../components/wp/Posts';
import TisBarChart from '../../components/charts/TisBarChart';

import { newsCategories } from '../News';

function PartyTransactions() {
    const party = useOutletContext();

    setTitle(party.name);

    return (
        <div className="subpage">
            <div className="row text-center my-4">
                <div className="col-lg-6">
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
                                outgoing: party.account.sum_outgoing,
                            },
                            {
                                name: labels.charts.incoming,
                                incoming: party.account.sum_incoming,
                            },
                        ]}
                        buttonLink={routes.charts}
                        currency
                        lastUpdate={false}
                    />
                </div>
                <div className="col-lg-6">
                    <div className="total-spending">
                        <h2 className="d-none d-lg-block mt-xxl-4">
                            Priebežné výdavky strany
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(party.account.sum_outgoing)}
                            <LastUpdateTag
                                short
                                timestamp={party.account.timestamp}
                            />
                        </p>
                    </div>

                    <div className="buttons text-center mt-4">
                        <Button
                            as={Link}
                            to={routes.party(party.slug, segments.TRANSACTIONS)}
                            variant="secondary"
                        >
                            Zobraziť všetky transakcie
                        </Button>
                    </div>
                </div>
            </div>

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
