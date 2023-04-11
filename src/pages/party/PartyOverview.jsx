import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Link, useOutletContext } from 'react-router-dom';

import { labels } from '../../api/constants';
import { currencyFormat, setTitle, shortenUrl } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

// import AccountTransactions from '../../components/accounts/AccountTransactions';
import Posts, { templates } from '../../components/wp/Posts';
import { newsCategories } from '../News';

function PartyTransactions() {
    const { party, partyAccount } = useOutletContext();

    setTitle(party.name);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">Informácie o kampani</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{labels.charts.incoming}</td>
                        <td>{currencyFormat(partyAccount.sum_incoming)}</td>
                    </tr>
                    <tr>
                        <td>{labels.charts.outgoing}</td>
                        <td>{currencyFormat(partyAccount.sum_outgoing)}</td>
                    </tr>
                    <tr>
                        <td>Bilancia</td>
                        <td>{currencyFormat(partyAccount.balance)}</td>
                    </tr>
                    <tr>
                        <td>Počet príjmov</td>
                        <td>{partyAccount.num_incoming}</td>
                    </tr>
                    <tr>
                        <td>Počet výdavkov</td>
                        <td>{partyAccount.num_outgoing}</td>
                    </tr>
                    <tr>
                        <td>{labels.charts.uniqeDonors}</td>
                        <td>{partyAccount.num_unique_donors}</td>
                    </tr>
                    <tr>
                        <td>{labels.elections.account}</td>
                        <td>
                            <a
                                href={
                                    partyAccount[labels.elections.account_key]
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shortenUrl(
                                    partyAccount[labels.elections.account_key]
                                )}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{labels.disclaimerAccount}</em>

            <div className="buttons text-center">
                <Button
                    as={Link}
                    to={routes.party(party.name, segments.TRANSACTIONS)}
                    variant="secondary"
                >
                    Všetky transakcie
                </Button>
            </div>

            <h2 className="mt-4">Najnovšie aktuality</h2>
            <Posts
                categories={newsCategories}
                limit={2}
                section={segments.NEWS}
                showMoreLink={routes.party(party.name, segments.NEWS)}
                tags={[party.tag]}
                template={templates.condensed}
            />
        </div>
    );
}

export default PartyTransactions;
