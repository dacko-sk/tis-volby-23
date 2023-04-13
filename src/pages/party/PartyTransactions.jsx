import Table from 'react-bootstrap/Table';
import { useOutletContext } from 'react-router-dom';

import { labels } from '../../api/constants';
import { currencyFormat, setTitle, shortenUrl } from '../../api/helpers';

import AccountTransactions from '../../components/accounts/AccountTransactions';

function PartyTransactions() {
    const party = useOutletContext();

    setTitle(`${party.name} : Financovanie`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">Informácie o kampani</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{labels.charts.incoming}</td>
                        <td>{currencyFormat(party.account.sum_incoming)}</td>
                    </tr>
                    <tr>
                        <td>{labels.charts.outgoing}</td>
                        <td>{currencyFormat(party.account.sum_outgoing)}</td>
                    </tr>
                    <tr>
                        <td>Zostatok</td>
                        <td>{currencyFormat(party.account.balance)}</td>
                    </tr>
                    <tr>
                        <td>Počet príjmov</td>
                        <td>{party.account.num_incoming}</td>
                    </tr>
                    <tr>
                        <td>Počet výdavkov</td>
                        <td>{party.account.num_outgoing}</td>
                    </tr>
                    <tr>
                        <td>{labels.charts.uniqeDonors}</td>
                        <td>{party.account.num_unique_donors}</td>
                    </tr>
                    <tr>
                        <td>{labels.elections.account}</td>
                        <td>
                            <a
                                href={
                                    party.account[labels.elections.account_key]
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shortenUrl(
                                    party.account[labels.elections.account_key]
                                )}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{labels.disclaimerAccount}</em>

            <AccountTransactions account={party.account} />
        </div>
    );
}

export default PartyTransactions;
