import { Col, Row } from 'react-bootstrap';

import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';

import { newsCategories } from './News';
import TotalAdsSpending from '../components/ads/TotalAdsSpending';
import Top10 from '../components/charts/Top10';
import Top10Ads from '../components/charts/Top10Ads';
import ElectionsCountdown from '../components/general/ElectionsCountdown';
import TotalSpending from '../components/accounts/TotalSpending';
import AlertWithIcon from '../components/general/AlertWithIcon';
import PartiesLogos from '../components/general/PartiesLogos';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';

function Home() {
    setTitle('Úvod');

    return (
        <section>
            <Title uppercase secondary="2023">
                Parlamentné
                <br />
                voľby
            </Title>

            <AlertWithIcon className="my-4" variant="primary">
                Vitajte na novej volebnej stránke pre predčasné parlamentné
                voľby v roku 2023.
                <br />
                Volebnú stránku k samosprávnym voľbám 2022 sme presunuli na
                podstránku{' '}
                <a
                    href="https://volby.transparency.sk/samosprava2022/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Samosprávne voľby 2022
                </a>
            </AlertWithIcon>

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

            <Top10 />

            <TotalAdsSpending />

            <Top10Ads />

            <PartiesLogos />

            <h2 className="mt-4">Najnovšie aktuality</h2>
            <Posts
                categories={newsCategories}
                limit={2}
                section={segments.NEWS}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
