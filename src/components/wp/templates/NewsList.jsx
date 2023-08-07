import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateTimeFormat } from '../../../api/helpers';
import { parseWpHtml } from '../../../api/wpHelpers';

import Media from '../Media';
import PartyTags from '../PartyTags';

function NewsList({ article, clickHandler, keyUpHandler }) {
    return (
        <Col md={12}>
            <div
                id={article.slug}
                className="article hover-bg"
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <Row className="align-items-center">
                    <Col md={5} lg={3}>
                        <div className="thumb mb-2 mb-md-0">
                            <figure className="text-center text-xxl-start">
                                <Media
                                    alt={article.title.rendered}
                                    id={article.featured_media}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title.rendered}</h2>
                        <div className="article-date my-2">
                            {dateTimeFormat(article.date)}
                        </div>
                        <PartyTags
                            className="article-tags my-2"
                            tags={article.tags}
                        />
                        {parseWpHtml(article.excerpt.rendered)}
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default NewsList;
