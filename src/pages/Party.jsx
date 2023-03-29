import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import has from 'has';

import { labels } from '../api/constants';
import { currencyFormat, setTitle, shortenUrl } from '../api/helpers';
import { routes } from '../api/routes';

import useData from '../context/DataContext';

import AccountTransactions from '../components/accounts/AccountTransactions';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

function Party() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let party = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            if (pathname === routes.party(row[labels.elections.name_key])) {
                party = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!party && has(csvData, 'data')) {
            // redirect to home page in case party does not exist
            navigate(routes.home);
        }
    }, [party, csvData, navigate]);

    if (!party || !has(csvData, 'data')) {
        return <Loading />;
    }

    setTitle(party[labels.elections.name_key]);

    return (
        <section className="party-page">
            <Title>{party[labels.elections.name_key]}</Title>
            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{labels.charts.incoming}</td>
                        <td>{currencyFormat(party.sum_incoming)}</td>
                    </tr>
                    <tr>
                        <td>{labels.charts.outgoing}</td>
                        <td>{currencyFormat(party.sum_outgoing)}</td>
                    </tr>
                    <tr>
                        <td>Bilancia</td>
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
                        <td>{labels.charts.uniqeDonors}</td>
                        <td>{party.num_unique_donors}</td>
                    </tr>
                    <tr>
                        <td>{labels.elections.account}</td>
                        <td>
                            <a
                                href={party[labels.elections.account_key]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shortenUrl(
                                    party[labels.elections.account_key]
                                )}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{labels.disclaimerAccount}</em>

            <AccountTransactions party={party} />
        </section>
    );
}

export default Party;
