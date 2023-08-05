import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';

import { labels } from '../../api/constants';
import { scrollToTop } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

import NewsCondensed from './templates/NewsCondensed';
import NewsList from './templates/NewsList';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';

import './News.scss';

export const templates = {
    condensed: 'condensed',
    featured: 'featured',
    list: 'list',
};

function Posts({
    categories = [],
    categoriesExclude = [],
    limit = false,
    noResults,
    search = '',
    section = segments.NEWS,
    showMore = null,
    showMoreLink = null,
    tags = [],
    template = templates.list,
}) {
    const [totalPages, setTotalPages] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const blocksize = limit || 10;
    const catParam = categories.length
        ? `&categories=${categories.join()}`
        : '';
    const catExParam = categoriesExclude.length
        ? `&categories_exclude=${categoriesExclude.join()}`
        : '';
    const tagParam = tags.length ? `&tags=${tags.join()}&tax_relation=AND` : '';
    const searchParam = search ? `&search=${search}` : '';
    const { isLoading, error, data } = useQuery(
        [
            `all_posts_${catParam}_${tagParam}_${search}_${blocksize}_${activePage}`,
        ],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=${blocksize}&page=${activePage}${catParam}${catExParam}${tagParam}${searchParam}`
            ).then((response) => {
                if (response.headers) {
                    const wptp = Number(
                        response.headers.get('X-WP-TotalPages')
                    );
                    setTotalPages(wptp);
                }
                // must return promise
                return response.json();
            })
    );

    const navigate = useNavigate();
    const getClickHandler = (article) => (event) => {
        if (event.target.tagName.toLowerCase() !== 'a') {
            navigate(routes.article(section, article.slug), {
                state: { article },
            });
        }
    };
    const getKeyUpHandler = (article) => (event) => {
        if (event.keyCode === 13) {
            navigate(routes.article(section, article.slug), {
                state: { article },
            });
        }
    };

    const loadPage = (page) => () => {
        setActivePage(page);
        scrollToTop();
    };

    const articles = [];
    let content = null;

    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        data.forEach((article) => {
            articles.push(
                template === templates.condensed ? (
                    <NewsCondensed
                        key={article.slug}
                        article={article}
                        clickHandler={getClickHandler(article)}
                        keyUpHandler={getKeyUpHandler(article)}
                    />
                ) : (
                    <NewsList
                        key={article.slug}
                        article={article}
                        clickHandler={getClickHandler(article)}
                        keyUpHandler={getKeyUpHandler(article)}
                    />
                )
            );
        });

        content = articles.length ? (
            <Row
                className={`articles ${template}${
                    template === templates.condensed ? ' my-3' : ''
                }`}
            >
                {articles}
            </Row>
        ) : (
            <AlertWithIcon className="my-4" variant="danger">
                {noResults ?? 'Neboli nájdené žiadne články.'}
            </AlertWithIcon>
        );
    }

    let nav = null;
    if (articles.length) {
        if (showMore || limit) {
            nav = (
                <div className="buttons mt-3 text-center">
                    <Button
                        as={Link}
                        to={showMoreLink || routes.articles(section)}
                        variant="secondary"
                    >
                        {showMore || labels.showMore}
                    </Button>
                </div>
            );
        } else {
            const items = [];
            for (let i = 1; i <= totalPages; i += 1) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === activePage}
                        onClick={loadPage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
            if (items.length > 1) {
                nav = (
                    <Pagination className="justify-content-center mt-4">
                        {items}
                    </Pagination>
                );
            }
        }
    }

    // reset active page to 1 if search query changes
    useEffect(() => {
        setActivePage(1);
    }, [search]);

    return (
        <div>
            {content}
            {nav}
        </div>
    );
}

export default Posts;
