import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet } from 'react-router-dom';

import { labels, t } from '../api/dictionary';
import { routes, segments } from '../api/routes';

import Title from '../components/structure/Title';

function Parties() {
    return (
        <section>
            <Title>{t(labels.parties.pageTitle)}</Title>

            <div className="tabs-scrollable mb-4">
                <Nav variant="tabs">
                    <Nav.Link as={NavLink} to={routes.parties()} end>
                        {t(labels.account.title)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.parties(segments.CANDIDATES)}
                    >
                        {t(labels.parties.candidatesLists)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.parties(segments.ASSETS)}>
                        {t(labels.parties.assets)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.parties(segments.REPORTS)}
                    >
                        {t(labels.parties.reports)}
                    </Nav.Link>
                </Nav>
            </div>

            <Outlet />
        </section>
    );
}

export default Parties;
