import Table from 'react-bootstrap/Table';
import { useOutletContext } from 'react-router-dom';

import { setTitle } from '../../api/browserHelpers';
import { labels, t } from '../../api/dictionary';
import { currencyFormat, shortenUrl } from '../../api/helpers';

import { csvAggregatedKeys } from '../../context/DataContext';

import AccountTransactions from '../../components/accounts/AccountTransactions';

import linkIcon from '../../../public/img/external_link_icon.svg?url';

function PartyTransactions() {
    const party = useOutletContext();

    setTitle(`${party.fullName} : Financovanie`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{t(labels.account.info)}</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.charts.incoming)}</td>
                        <td>
                            {currencyFormat(party[csvAggregatedKeys.incoming])}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.outgoing)}</td>
                        <td>
                            {currencyFormat(party[csvAggregatedKeys.outgoing])}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.balance)}</td>
                        <td>{currencyFormat(party.balance)}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.incomesAmount)}</td>
                        <td>{party.num_incoming}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.expensesAmount)}</td>
                        <td>{party.num_outgoing}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.uniqeDonors)}</td>
                        <td>{party.num_unique_donors}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.elections.account)}</td>
                        <td>
                            <a
                                href={party[csvAggregatedKeys.account]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="me-2">
                                    <span className="d-md-none">
                                        {shortenUrl(
                                            party[csvAggregatedKeys.account]
                                        )}
                                    </span>
                                    <span className="d-none d-md-inline">
                                        {party[csvAggregatedKeys.account]}
                                    </span>
                                </span>
                                <img className="inline-icon" src={linkIcon} />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{t(labels.disclaimerAccount)}</em>

            <AccountTransactions account={party} />
        </div>
    );
}

export default PartyTransactions;
