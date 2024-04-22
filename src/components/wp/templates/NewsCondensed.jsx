import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateTimeFormat } from '../../../api/helpers';
import { routes } from '../../../api/routes';
import { parseWpHtml } from '../../../api/wpHelpers';

import Media from '../Media';
import PartyTags from '../PartyTags';

function NewsCondensed({ article }) {
    return (
        <Col className="d-flex" md={6}>
            <Link
                id={article.slug}
                className="article hover-bg"
                state={{ article }}
                to={routes.article(article.slug)}
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
                            tags={article.tags}
                        />
                        <div className="article-excerpt">
                            {parseWpHtml(article.excerpt.rendered)}
                        </div>
                    </Col>
                </Row>
            </Link>
        </Col>
    );
}

export default NewsCondensed;
