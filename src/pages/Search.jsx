import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../api/browserHelpers';
import { labels, t } from '../api/dictionary';
import { contains } from '../api/helpers';
import { routes, segments } from '../api/routes';
import { wpCat } from '../api/wpHelpers';

import useAdsData, { csvConfig, csvFiles } from '../context/AdsDataContext';
import useData, { csvAggregatedKeys } from '../context/DataContext';

import AlertWithIcon from '../components/general/AlertWithIcon';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

import linkIcon from '../../public/img/external_link_icon.svg?url';
import pdfIcon from '../../public/img/PDF_icon.svg?url';

function Search({ googleColumns = csvConfig[csvFiles.GOOGLE].columns }) {
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
    const candidatesLists = [];
    const assets = [];
    const reports = [];
    const accounts = [];
    if (csvData.data ?? false) {
        csvData.data.forEach((row) => {
            // party name matches - list party
            if (
                contains(row[csvAggregatedKeys.name], query) ||
                contains(row.fbName, query) ||
                contains(row.fullName, query) ||
                contains(row.slug, query)
            ) {
                const link = routes.party(row[csvAggregatedKeys.name]);
                parties.push(
                    <Col
                        key={row[csvAggregatedKeys.name]}
                        className="d-flex"
                        sm
                    >
                        <Link
                            to={link}
                            className="d-flex flex-column justify-content-between w-100 cat-local"
                        >
                            <h3>{row[csvAggregatedKeys.name]}</h3>
                            <div className="town mt-3">{row.fullName}</div>
                        </Link>
                    </Col>
                );

                if (sheetsData.candidatesLists[row.fbName] ?? false) {
                    candidatesLists.push(
                        <Col key={row.fbName} className="d-flex" sm>
                            <a
                                className="d-flex flex-column justify-content-between w-100 cat-local"
                                href={sheetsData.candidatesLists[row.fbName]}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="download"
                            >
                                <h3>
                                    <span className="me-2">{row.fullName}</span>
                                    <img
                                        className="inline-icon"
                                        src={pdfIcon}
                                    />
                                </h3>
                            </a>
                        </Col>
                    );
                }

                if (sheetsData.assets[row.fbName] ?? false) {
                    assets.push(
                        <Col key={row.fbName} className="d-flex" sm>
                            <a
                                className="d-flex flex-column justify-content-between w-100 cat-local"
                                href={sheetsData.assets[row.fbName]}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="download"
                            >
                                <h3>
                                    <span className="me-2">
                                        {`${row.fullName} - ${t(labels.party.extendedAssets)}`}
                                    </span>
                                    <img
                                        className="inline-icon"
                                        src={pdfIcon}
                                    />
                                </h3>
                            </a>
                        </Col>
                    );
                }

                if (sheetsData.reports[row.fbName] ?? false) {
                    reports.push(
                        <Col key={row.fbName} className="d-flex" sm>
                            <a
                                className="d-flex flex-column justify-content-between w-100 cat-local"
                                href={sheetsData.reports[row.fbName]}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="download"
                            >
                                <h3>
                                    <span className="me-2">{row.fullName}</span>
                                    <img
                                        className="inline-icon"
                                        src={pdfIcon}
                                    />
                                </h3>
                            </a>
                        </Col>
                    );
                }

                accounts.push(
                    <Col key={row.fbName} className="d-flex" sm>
                        <a
                            className="d-flex flex-column justify-content-between w-100 cat-local"
                            href={row[csvAggregatedKeys.account]}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="download"
                        >
                            <h3>
                                <span className="me-2">{row.fullName}</span>
                                <img className="inline-icon" src={linkIcon} />
                            </h3>
                        </a>
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
                            party[csvAggregatedKeys.name],
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
                                        {t(labels.ads.meta.title)}
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
            const accountName = pageData[googleColumns.PAGE_NAME] ?? null;
            // account name matches - list party
            if (contains(accountName, query)) {
                const accountParty = findPartyForGoogleAccount(
                    pageData[googleColumns.ID]
                );
                if (accountParty) {
                    const party = findPartyByFbName(accountParty);
                    if (party) {
                        const link = routes.party(
                            party[csvAggregatedKeys.name],
                            segments.ONLINE
                        );
                        online.push(
                            <Col
                                key={`ggl${pageData[googleColumns.ID]}`}
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
                                        {t(labels.ads.google.title)}
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
            navigate(routes.home());
        }
    }, [query]);

    setTitle(`${t(labels.search.results)} „${query}“`);

    return (
        <section className="search-results">
            <Title secondary={`„${query}“`}>
                {t(labels.search.results)}
                <br />
            </Title>

            <h2 className="my-4">{t(labels.parties.pageTitle)}</h2>
            {parties.length ? (
                <Row className="tiles gx-4 gy-4">{parties}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.parties.noParty)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.parties.candidatesLists)}</h2>
            {candidatesLists.length ? (
                <Row className="tiles gx-4 gy-4">{candidatesLists}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.parties.noParty)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.parties.assets)}</h2>
            {assets.length ? (
                <Row className="tiles gx-4 gy-4">{assets}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.parties.noParty)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.parties.reports)}</h2>
            {reports.length ? (
                <Row className="tiles gx-4 gy-4">{reports}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.parties.noParty)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.account.title)}</h2>
            {accounts.length ? (
                <Row className="tiles gx-4 gy-4">{accounts}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.parties.noResults)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.ads.partyAccounts)}</h2>
            {online.length ? (
                <Row className="tiles gx-4 gy-4">{online}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.ads.noAccounts)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.news.pageTitle)}</h2>
            <Posts
                categories={[wpCat.news]}
                noResults={t(labels.news.noData)}
                search={query}
            />
        </section>
    );
}

export default Search;
