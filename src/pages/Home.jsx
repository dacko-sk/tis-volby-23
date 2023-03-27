import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';

import { newsCategories } from './News';
import Top10 from '../components/charts/Top10';
import ElectionsCountdown from '../components/general/ElectionsCountdown';
import TotalSpending from '../components/general/TotalSpending';
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

            <div className="row gy-3 gy-lg-0 text-center mb-4">
                <div className="col-lg-6">
                    <ElectionsCountdown
                        start="2023-09-30T07:00:00"
                        end="2023-09-30T20:00:00"
                    />
                </div>
                <div className="col-lg-6">
                    <TotalSpending />
                </div>
            </div>

            <Top10 />

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
