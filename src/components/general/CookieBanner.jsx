import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import has from 'has';

import useCookies, {
    generateSetter,
    setAnaliticsStorage,
} from '../../context/CookiesContext';

import './CookieBanner.scss';

function CookieBanner() {
    const { cookies, setCookies } = useCookies();
    const [checkFunctional, setCheckFunctional] = useState(
        cookies && has(cookies, 'functional') ? cookies.functional : false
    );
    const [checkAnalytics, setCheckAnalytics] = useState(
        cookies && has(cookies, 'analytics') ? cookies.analytics : false
    );

    const checkFunctionalChange = (event) => {
        setCheckFunctional(event.target.checked);
    };

    const checkAnalyticsChange = (event) => {
        setCheckAnalytics(event.target.checked);
    };

    const openSettingsClick = () => {
        setCookies(generateSetter(true, checkFunctional, checkAnalytics));
    };

    const acceptSelectionClick = () => {
        setCookies(generateSetter(false, checkFunctional, checkAnalytics));
    };

    const setAllChecks = (enabled) => {
        setCheckFunctional(enabled);
        setCheckAnalytics(enabled);
        setCookies(generateSetter(false, enabled, enabled));
    };

    const rejectAllClick = () => setAllChecks(false);

    const acceptAllClick = () => setAllChecks(true);

    // update google tag privacy rules on first load
    useEffect(() => {
        setAnaliticsStorage(false);
    }, []);

    return (
        <div className="my-3">
            <Button variant="primary" onClick={openSettingsClick}>
                Nastavenia cookies
            </Button>
            {cookies.open && (
                <Container fluid className="cookie-banner py-4">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <p>
                                Táto webová stránka používa cookies, aby vám
                                priniesla čo najlepší online zážitok.{' '}
                                <a
                                    href="https://transparency.sk/sk/sukromie/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Zistiť viac
                                </a>
                            </p>

                            <Accordion flush className="my-3">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        Voliteľné cookies
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Form className="d-flex justify-content-center flex-column flex-sm-row">
                                            <Form.Check
                                                className="mx-2"
                                                disabled
                                                checked
                                                type="switch"
                                                id="cookies-necessary"
                                                label="Nevyhnutné cookies"
                                            />
                                            <Form.Check
                                                className="mx-2"
                                                checked={checkFunctional}
                                                onChange={checkFunctionalChange}
                                                type="switch"
                                                label="Funkčné cookies"
                                                id="cookies-functional"
                                            />
                                            <Form.Check
                                                className="mx-2"
                                                checked={checkAnalytics}
                                                onChange={checkAnalyticsChange}
                                                type="switch"
                                                label="Analytické cookies"
                                                id="cookies-analytics"
                                            />
                                        </Form>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <div className="d-flex justify-content-center flex-column flex-sm-row">
                                <Button
                                    className="mb-2 mb-sm-0 me-0 me-sm-3"
                                    variant="success"
                                    onClick={rejectAllClick}
                                >
                                    Odmietnuť všetky
                                </Button>
                                <Button
                                    className="mb-2 mb-sm-0 me-0 me-sm-3"
                                    variant="success"
                                    onClick={acceptSelectionClick}
                                >
                                    Potvrdiť výber
                                </Button>
                                <Button
                                    // className="m-2"
                                    variant="secondary"
                                    onClick={acceptAllClick}
                                >
                                    Prijať všetky
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}

export default CookieBanner;
