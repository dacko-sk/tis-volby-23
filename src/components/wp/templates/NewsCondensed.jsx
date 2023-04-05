import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateTimeFormat, parseWpHtml } from '../../../api/helpers';

import Media from '../Media';
import PartyTags from '../PartyTags';

function NewsCondensed({ article, clickHandler, keyUpHandler }) {
    return (
        <Col className="d-flex" md={6}>
            <div
                id={article.slug}
                className="article hover-bg"
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <h2 className="d-none d-xxl-block">{article.title.rendered}</h2>

                <Row className="align-items-center align-items-xxl-start">
                    <Col xxl="auto" className="align-self-xxl-start">
                        <div className="thumb mb-2 mb-xxl-0 mt-xxl-2">
                            <figure className="text-center text-xxl-start">
                                <Media
                                    alt={article.title.rendered}
                                    id={article.featured_media}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2 className="d-block d-xxl-none">
                            {article.title.rendered}
                        </h2>
                        <div className="article-date my-2">
                            {dateTimeFormat(article.date)}
                        </div>
                        <PartyTags
                            className="article-tags my-2"
                            categories={article.categories}
                        />
                        {parseWpHtml(article.excerpt.rendered)}
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default NewsCondensed;
