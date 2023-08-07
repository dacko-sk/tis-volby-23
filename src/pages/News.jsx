import { wpCat } from '../api/constants';
import { setTitle } from '../api/helpers';

import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

const title = 'Aktuality';

function News() {
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <Posts categories={[wpCat.news]} />
        </section>
    );
}

export default News;
