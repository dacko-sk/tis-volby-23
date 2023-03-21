import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';

import { newsCategories } from './News';
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
