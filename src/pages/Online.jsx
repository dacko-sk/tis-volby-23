import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import Google from '../components/ads/Google';
import Meta from '../components/ads/Meta';
import Title from '../components/structure/Title';

function Online() {
    return (
        <section className="charts-page">
            <Title>Online kampane</Title>
            <Tab.Container id="providers" defaultActiveKey="facebook">
                <div className="overflow-auto">
                    <Nav variant="tabs" className="flex-nowrap">
                        <Nav.Link eventKey="facebook">Meta</Nav.Link>
                        <Nav.Link eventKey="google">Google</Nav.Link>
                    </Nav>
                </div>

                <Tab.Content className="mt-4">
                    <Tab.Pane eventKey="facebook">
                        <Meta />
                    </Tab.Pane>
                    <Tab.Pane eventKey="google">
                        <Google />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </section>
    );
}

export default Online;
