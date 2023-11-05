import { setTitle } from '../api/browserHelpers';
import { labels, t } from '../api/dictionary';
import { wpCat } from '../api/wpHelpers';

import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

function News() {
    setTitle(t(labels.news.navTitle));

    return (
        <section>
            <Title>{t(labels.news.pageTitle)}</Title>
            <Posts categories={[wpCat.news]} />
        </section>
    );
}

export default News;
