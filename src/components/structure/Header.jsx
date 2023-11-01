import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { labels } from '../../api/constants';
import {
    getCurrentLanguage,
    languages,
    localizePath,
    routes,
} from '../../api/routes';

import DonateButton from '../general/DonateButton';
import SearchField from '../general/SearchField';

import logo from '../../../public/img/tis-logo-blue.png';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to={routes.home()}>
                    <img src={logo} alt={labels.tis} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        defaultActiveKey={routes.home()}
                        variant="pills"
                        className="me-auto"
                    >
                        <Nav.Link as={NavLink} to={routes.home()}>
                            Voľby 2023
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.parties()}>
                            Strany
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.online()}>
                            Online
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.news()}>
                            Aktuality
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.analyses()}>
                            Hodnotenia
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
