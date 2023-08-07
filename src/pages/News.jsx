import { wpCat } from '../api/constants';
import { setTitle } from '../api/helpers';

import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

export const newsCategories = [wpCat.news];

const title = 'Aktuality';

function News() {
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <Posts categories={newsCategories} />
        </section>
    );
}

export default News;
