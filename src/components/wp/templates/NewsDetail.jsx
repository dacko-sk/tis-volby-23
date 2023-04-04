import { dateTimeFormat, parseWpHtml } from '../../../api/helpers';

import PartyTags from '../PartyTags';

function NewsDetail({ article }) {
    return (
        <div className="article-body">
            <div className="d-md-flex">
                <div className="article-date my-4 me-auto">
                    {dateTimeFormat(article.date)}
                </div>
                <PartyTags
                    className="article-tags my-4"
                    categories={article.categories}
                />
            </div>
            {parseWpHtml(article.content.rendered)}
        </div>
    );
}

export default NewsDetail;
