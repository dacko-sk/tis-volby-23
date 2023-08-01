import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels } from '../api/constants';
import { contains, setTitle } from '../api/helpers';
import { routes, segments } from '../api/routes';

import useAdsData, { sheetsConfig } from '../context/AdsDataContext';
import useData from '../context/DataContext';

import { newsCategories } from './News';
import AlertWithIcon from '../components/general/AlertWithIcon';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

function Search() {
    const params = useParams();
    const query = params.query ?? null;
    const navigate = useNavigate();

    const { csvData, findPartyByFbName } = useData();
    const {
        findPartyForFbAccount,
        findPartyForGoogleAccount,
        mergedWeeksData,
        sheetsData,
    } = useAdsData();

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
                        key={row[labels.elections.name_key]}
                        className="d-flex"
                        sm
                    >
                        <Link
                            to={link}
                            className="d-flex flex-column justify-content-between w-100 cat-local"
                        >
                            <h3>{row[labels.elections.name_key]}</h3>
                            <div className="town mt-3">{row.fullName}</div>
                        </Link>
                    </Col>
                );
            }
        });
    }

    // parse data from sheets
    const online = [];
    if (sheetsData.lastUpdateFb) {
        Object.entries(mergedWeeksData).forEach(([pageId, pageProps]) => {
            // account name matches - list party
            if (contains(pageProps.name, query)) {
                const accountParty = findPartyForFbAccount(pageId);
                if (accountParty) {
                    const party = findPartyByFbName(accountParty);
                    if (party) {
                        const link = routes.party(
                            party[labels.elections.name_key],
                            segments.ONLINE
                        );
                        online.push(
                            <Col key={`fb${pageId}`} className="d-flex" sm>
                                <Link
                                    to={link}
                                    className="d-flex flex-column justify-content-between w-100 cat-local"
                                >
                                    <h3>{pageProps.name}</h3>
                                    <div className="town my-3">
                                        {party.fullName}
                                    </div>
                                    <div className="type">
                                        {labels.ads.meta.title}
                                    </div>
                                </Link>
                            </Col>
                        );
                    }
                }
            }
        });
    }
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const accountName =
                pageData[sheetsConfig.GOOGLE.columns.PAGE_NAME] ?? null;
            // account name matches - list party
            if (contains(accountName, query)) {
                const accountParty = findPartyForGoogleAccount(
                    pageData[sheetsConfig.GOOGLE.columns.ID]
                );
                if (accountParty) {
                    const party = findPartyByFbName(accountParty);
                    if (party) {
                        const link = routes.party(
                            party[labels.elections.name_key],
                            segments.ONLINE
                        );
                        online.push(
                            <Col
                                key={`ggl${
                                    pageData[sheetsConfig.GOOGLE.columns.ID]
                                }`}
                                className="d-flex"
                                sm
                            >
                                <Link
                                    to={link}
                                    className="d-flex flex-column justify-content-between w-100 cat-regional"
                                >
                                    <h3>{accountName}</h3>
                                    <div className="town my-3">
                                        {party.fullName}
                                    </div>
                                    <div className="type">
                                        {labels.ads.google.title}
                                    </div>
                                </Link>
                            </Col>
                        );
                    }
                }
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

            <h2 className="my-4">Online účty strán</h2>
            {online.length ? (
                <Row className="tiles gx-4 gy-4">{online}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    Hľadanému výrazu nezodpovedá žiaden online účet.
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
