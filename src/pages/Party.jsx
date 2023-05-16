import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

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
    let party = null;
    let accountKey = decodeSlug(slug);
    if (csvData.data ?? false) {
        // find CSV account key if slug is not identical as config key
        if (!(parties[accountKey] ?? false)) {
            Object.entries(parties).some(([partyKey, partyProps]) => {
                if (
                    (partyProps.slug ?? false) &&
                    accountKey === partyProps.slug
                ) {
                    accountKey = partyKey;
                    return true;
                }
                return false;
            });
        }
        // find aggregated data for the account
        csvData.data.some((row) => {
            if (accountKey === row[labels.elections.name_key]) {
                party = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!party && (csvData.data ?? false)) {
            // redirect to home page in case party does not have transparent account
            navigate(routes.home);
        }
    }, [party, csvData, navigate]);

    if (!party || !(csvData.data ?? false)) {
        return <Loading />;
    }

    return (
        <section className="party-page">
            <Title>
                {(party.logo ?? false) && (
                    <>
                        <img className="logo my-2" src={party.logo} />
                        <br />
                    </>
                )}
                {party.fullName}
            </Title>
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
                <Nav.Link
                    as={NavLink}
                    to={routes.party(party.slug, segments.ONLINE)}
                >
                    Online
                </Nav.Link>
                {(party.tag ?? false) && (
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
