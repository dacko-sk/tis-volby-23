import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import has from 'has';

import { labels, parties } from '../api/constants';
import { decodeSlug, routes, segments } from '../api/routes';

import useData from '../context/DataContext';

import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

function Party() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let partyAccount = null;
    let accountKey = decodeSlug(slug);
    if (has(csvData, 'data')) {
        // find CSV account key if slug is not identical as config key
        if (!has(parties, accountKey)) {
            Object.entries(parties).some(([partyKey, partyProps]) => {
                if (has(partyProps, 'slug') && accountKey === partyProps.slug) {
                    accountKey = partyKey;
                    return true;
                }
                return false;
            });
        }
        // find aggregated data for the account
        csvData.data.some((row) => {
            if (accountKey === row[labels.elections.name_key]) {
                partyAccount = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!partyAccount && has(csvData, 'data')) {
            // redirect to home page in case party does not have transparent account
            navigate(routes.home);
        }
    }, [partyAccount, csvData, navigate]);

    if (!partyAccount || !has(csvData, 'data')) {
        return <Loading />;
    }

    // prepare party object to be used by subpages via outlet context
    let party = {
        account: partyAccount,
        // copy full name & slug from account key as default
        name: accountKey,
        slug: accountKey,
    };
    if (has(parties, accountKey)) {
        party = {
            ...party,
            ...parties[accountKey],
        };
    }

    return (
        <section className="party-page">
            <Title>{party.name}</Title>
            <Nav variant="tabs" className="me-auto">
                <Nav.Link as={NavLink} to={routes.party(party.slug)} end>
                    Prehľad
                </Nav.Link>
                <Nav.Link
                    as={NavLink}
                    to={routes.party(party.slug, segments.TRANSACTIONS)}
                >
                    Financovanie
                </Nav.Link>
                {has(party, 'tag') && (
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(party.slug, segments.NEWS)}
                    >
                        Aktuality
                    </Nav.Link>
                )}
            </Nav>

            <Outlet context={party} />
        </section>
    );
}

export default Party;
