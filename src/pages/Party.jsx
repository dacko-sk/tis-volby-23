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
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            if (decodeSlug(slug) === row[labels.elections.name_key]) {
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

    const party = {
        ...parties[partyAccount[labels.elections.name_key]],
        name: partyAccount[labels.elections.name_key],
    };

    return (
        <section className="party-page">
            <Title>{partyAccount[labels.elections.name_key]}</Title>
            <Nav variant="tabs" className="me-auto">
                <Nav.Link as={NavLink} to={routes.party(slug)} end>
                    Prehľad
                </Nav.Link>
                <Nav.Link
                    as={NavLink}
                    to={routes.party(slug, segments.TRANSACTIONS)}
                >
                    Financovanie
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.party(slug, segments.NEWS)}>
                    Aktuality
                </Nav.Link>
            </Nav>

            <Outlet context={{ party, partyAccount }} />
        </section>
    );
}

export default Party;
