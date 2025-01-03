import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { elections } from '../../api/constants';
import { labels, t } from '../../api/dictionary';
import {
    getCurrentLanguage,
    languages,
    localizePath,
    routes,
} from '../../api/routes';

import SiteSelector from './SiteSelector';
import DonateButton from '../general/DonateButton';
import SearchField from '../general/SearchField';

import logo from '../../../public/img/tis-logo-blue.png';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="https://volby.transparency.sk">
                    <img src={logo} alt={t(labels.tis)} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        defaultActiveKey={routes.home()}
                        variant="pills"
                        className="me-auto"
                    >
                        <SiteSelector site={elections.n23} />
                        <Nav.Link as={NavLink} to={routes.parties()}>
                            {t(labels.parties.navTitle)}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.online()}>
                            {t(labels.online.navTitle)}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.news()}>
                            {t(labels.news.navTitle)}
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.analyses()}>
                            {t(labels.analyses.navTitle)}
                        </Nav.Link>
                    </Nav>
                    <SearchField />
                    <Nav variant="pills" className="me-2">
                        <NavDropdown
                            title={getCurrentLanguage()}
                            id="language-menu"
                            align="end"
                            className="text-uppercase"
                        >
                            {Object.keys(languages).map((lang) => (
                                <NavDropdown.Item
                                    key={lang}
                                    as={NavLink}
                                    to={localizePath(lang)}
                                >
                                    {lang}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                    </Nav>
                    <DonateButton xl />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
