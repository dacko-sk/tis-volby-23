import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels } from '../api/constants';
import { contains, setTitle } from '../api/helpers';
import { routes, segments } from '../api/routes';

import useData from '../context/DataContext';

import { newsCategories } from './News';
import AlertWithIcon from '../components/general/AlertWithIcon';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

function Search() {
    const params = useParams();
    const query = params.query ?? null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const parties = [];
    if (csvData.data ?? false) {
        csvData.data.forEach((row) => {
            // party name matches - list party
            if (
                contains(row[labels.elections.name_key], query) ||
                contains(row.fbName, query) ||
                contains(row.fullName, query) ||
                contains(row.slug, query)
            ) {
                const link = routes.party(row[labels.elections.name_key]);
                parties.push(
                    <Col
                        key={
                            row[labels.elections.name_key] +
                            row[labels.elections.municipality_key]
                        }
                        className="d-flex"
                        sm
                    >
                        <Link
                            to={link}
                            className="d-flex flex-column justify-content-between w-100 cat-local"
                        >
                            <h3>{row[labels.elections.name_key]}</h3>
                            <div className="type">{row.fullName}</div>
                        </Link>
                    </Col>
                );
            }
        });
    }

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home);
        }
    }, [query]);

    setTitle(`Výsledky vyhľadávania výrazu „${query}“`);

    return (
        <section className="search-results">
            <Title multiline secondary={`„${query}“`}>
                Výsledky vyhľadávania výrazu
            </Title>

            <h2 className="my-4">Strany a hnutia</h2>
            {parties.length ? (
                <Row className="tiles gx-4 gy-4">{parties}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    Hľadanému výrazu nezodpovedá žiadna zo strán, ktoré
                    kandidujú v parlamentných voľbách 2023.
                </AlertWithIcon>
            )}

            <h2 className="my-4">Aktuality</h2>
            <Posts
                categories={newsCategories}
                noResults="Hľadaný výraz nebol nájdený v žiadnej z aktualít."
                section={segments.NEWS}
                search={query}
            />
        </section>
    );
}

export default Search;
