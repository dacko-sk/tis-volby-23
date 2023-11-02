import Table from 'react-bootstrap/Table';
import { useOutletContext } from 'react-router-dom';

import { labels, t } from '../../api/dictionary';
import { currencyFormat, setTitle, shortenUrl } from '../../api/helpers';

import { csvAggregatedKeys } from '../../context/DataContext';

import AccountTransactions from '../../components/accounts/AccountTransactions';

function PartyTransactions() {
    const party = useOutletContext();

    setTitle(`${party.fullName} : Financovanie`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">Informácie o kampani</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.charts.incoming)}</td>
                        <td>{currencyFormat(party.sum_incoming)}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.outgoing)}</td>
                        <td>{currencyFormat(party.sum_outgoing)}</td>
                    </tr>
                    <tr>
                        <td>Zostatok</td>
                        <td>{currencyFormat(party.balance)}</td>
                    </tr>
                    <tr>
                        <td>Počet príjmov</td>
                        <td>{party.num_incoming}</td>
                    </tr>
                    <tr>
                        <td>Počet výdavkov</td>
                        <td>{party.num_outgoing}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.uniqeDonors)}</td>
                        <td>{party.num_unique_donors}</td>
                    </tr>
                    <tr>
                        <td>{labels.elections.account}</td>
                        <td>
                            <a
                                href={party[csvAggregatedKeys.account]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shortenUrl(party[csvAggregatedKeys.account])}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{labels.disclaimerAccount}</em>

            <AccountTransactions account={party} />
        </div>
    );
}

export default PartyTransactions;
