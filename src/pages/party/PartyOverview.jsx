import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link, useOutletContext } from 'react-router-dom';

import { setTitle } from '../../api/browserHelpers';
import { labels, t } from '../../api/dictionary';
import { currencyFormat, fixNumber, isNumeric } from '../../api/helpers';
import { routes, segments } from '../../api/routes';
import { wpCat } from '../../api/wpHelpers';

import useAdsData, { csvConfig, csvFiles } from '../../context/AdsDataContext';
import { csvAggregatedKeys } from '../../context/DataContext';

import DownloadLink from '../../components/general/DownloadLink';
import LastUpdateTag from '../../components/general/LastUpdateTag';
import Posts, { templates } from '../../components/wp/Posts';

function PartyTransactions({
    googleColumns = csvConfig[csvFiles.GOOGLE].columns,
}) {
    const party = useOutletContext();

    const {
        findPartyForFbAccount,
        findPartyForGoogleAccount,
        mergedWeeksData,
        sheetsData,
    } = useAdsData();

    setTitle(party.fullName);

    // add FB totals from precampaing & all weeks (sheets) of campaing
    let totalMeta = 0;
    Object.entries(mergedWeeksData).forEach(([pageId, pageData]) => {
        const accountParty = findPartyForFbAccount(pageId);
        if (party.fbName === accountParty && isNumeric(pageData.outgoing)) {
            totalMeta += pageData.outgoing;
        }
    });

    // add google totals
    let totalGoogle = 0;
    sheetsData.googleAds.forEach((pageData) => {
        const accountParty = findPartyForGoogleAccount(
            pageData[googleColumns.ID]
        );
        if (party.fbName === accountParty) {
            totalGoogle += fixNumber(pageData[googleColumns.SPENDING]);
        }
    });

    return (
        <div className="subpage">
            <Row className="my-4">
                <Col lg={6}>
                    <h2 className="text-center mb-4">{t(labels.party.info)}</h2>
                    <div className="mb-4">
                        <DownloadLink
                            to={routes.party(party.name, segments.TRANSACTIONS)}
                        >
                            {t(labels.elections.account)}
                        </DownloadLink>

                        {(sheetsData.candidatesLists[party.fbName] ??
                            false) && (
                            <DownloadLink
                                to={sheetsData.candidatesLists[party.fbName]}
                            >
                                {t(labels.party.candidatesList)}
                            </DownloadLink>
                        )}

                        {(sheetsData.assets[party.fbName] ?? false) && (
                            <DownloadLink to={sheetsData.assets[party.fbName]}>
                                {t(labels.party.extendedAssets)}
                            </DownloadLink>
                        )}

                        {(sheetsData.reports[party.fbName] ?? false) && (
                            <DownloadLink to={sheetsData.reports[party.fbName]}>
                                {t(labels.party.report)}
                            </DownloadLink>
                        )}
                    </div>
                </Col>
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2>{t(labels.account.partySpending)}</h2>
                        <p className="hero-number">
                            {currencyFormat(party[csvAggregatedKeys.outgoing])}
                            <LastUpdateTag timestamp={party.timestamp} />
                        </p>
                    </div>

                    <div className="buttons mt-4">
                        <Button
                            as={Link}
                            to={routes.party(party.slug, segments.TRANSACTIONS)}
                            variant="secondary"
                        >
                            {t(labels.account.allTransactions)}
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="my-4">
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-3">
                            {t(labels.ads.meta.totalSpendingTitle)}
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(totalMeta)}
                            <LastUpdateTag
                                timestamp={sheetsData.lastUpdateFb || null}
                            >
                                {t(labels.ads.meta.totalDisclaimer)}
                            </LastUpdateTag>
                        </p>
                    </div>
                </Col>
                <Col lg={6} className="text-center">
                    <div className="total-spending">
                        <h2 className="mt-xxl-3">
                            {t(labels.ads.google.totalSpendingTitle)}
                        </h2>
                        <p className="hero-number">
                            {currencyFormat(totalGoogle)}
                            <LastUpdateTag
                                timestamp={sheetsData.lastUpdateFb || null}
                            >
                                {t(labels.ads.google.totalDisclaimer)}
                            </LastUpdateTag>
                        </p>
                    </div>
                </Col>
            </Row>

            <div className="buttons my-4 text-center">
                <Button
                    as={Link}
                    to={routes.party(party.slug, segments.ONLINE)}
                    variant="secondary"
                >
                    {t(labels.ads.showMore)}
                </Button>
            </div>

            {(party.tag ?? false) && (
                <>
                    <h2 className="mt-4">{t(labels.news.latest)}</h2>
                    <Posts
                        categories={[wpCat.news]}
                        limit={2}
                        showMoreLink={routes.party(party.slug, segments.NEWS)}
                        tags={[party.tag]}
                        template={templates.condensed}
                    />
                </>
            )}
        </div>
    );
}

export default PartyTransactions;
