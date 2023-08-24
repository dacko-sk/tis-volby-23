import { Col, Row } from 'react-bootstrap';

import { setTitle } from '../api/helpers';
import { routes } from '../api/routes';
import { wpCat } from '../api/wpHelpers';

import TotalAdsSpending from '../components/ads/TotalAdsSpending';
import Top10 from '../components/charts/Top10';
import Top10Ads from '../components/charts/Top10Ads';
import ElectionsCountdown from '../components/general/ElectionsCountdown';
import TotalSpending from '../components/accounts/TotalSpending';
// import PartiesLogos from '../components/general/PartiesLogos';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
import DonateButton from '../components/general/DonateButton';

function Home() {
    setTitle('Úvod');

    return (
        <section>
            <Title uppercase secondary="2023">
                Parlamentné
                <br />
                voľby
            </Title>

            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <ElectionsCountdown
                        start="2023-09-30T07:00:00"
                        end="2023-09-30T20:00:00"
                    />
                </Col>
                <Col lg={6}>
                    <TotalSpending />
                </Col>
            </Row>

            <div className="text-center mb-4">
                <DonateButton long xl />
            </div>

            <Top10 />

            <Posts
                categories={[wpCat.featured]}
                showMore="Zobraziť všetky hodnotenia"
                showMoreLink={routes.analyses}
                template={templates.featured}
            />

            <TotalAdsSpending />

            <Top10Ads />

            {/* <PartiesLogos /> */}

            <h2 className="mt-4 mb-3">Najnovšie aktuality</h2>
            <Posts
                categories={[wpCat.news]}
                limit={2}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
