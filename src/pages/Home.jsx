import { Col, Row } from 'react-bootstrap';

import { setTitle } from '../api/browserHelpers';
import { elections } from '../api/constants';
import { labels, t } from '../api/dictionary';
import { routes } from '../api/routes';
import { wpCat } from '../api/wpHelpers';

import TotalAdsSpending from '../components/ads/TotalAdsSpending';
import Top10 from '../components/charts/Top10';
import Top10Ads from '../components/charts/Top10Ads';
import ElectionsCountdown from '../components/general/ElectionsCountdown';
import TotalSpending from '../components/accounts/TotalSpending';
import SiteNavigator from '../components/structure/SiteNavigator';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
import DonateButton from '../components/general/DonateButton';

function Home() {
    setTitle(t(labels.home.pageTitle));

    return (
        <section>
            <Title secondaryWords={1} uppercase>
                {t(labels.home.pageTitle)}
            </Title>

            <div id="search-container">
                <SiteNavigator site={elections.n23} />
            </div>

            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <ElectionsCountdown
                        start="2023-09-30T07:00:00"
                        end="2023-09-30T22:00:00"
                    />
                </Col>
                <Col lg={6}>
                    <TotalSpending finalReport />
                </Col>
            </Row>

            <div className="text-center mb-4">
                <DonateButton long xl />
            </div>

            <Top10 finalReport />

            <Posts
                categories={[wpCat.featured]}
                showMore={t(labels.analyses.showAll)}
                showMoreLink={routes.analyses()}
                template={templates.featured}
            />

            <TotalAdsSpending />

            <Top10Ads />

            <h2 className="mt-4 mb-3">{t(labels.news.latest)}</h2>
            <Posts
                categories={[wpCat.news]}
                limit={2}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
