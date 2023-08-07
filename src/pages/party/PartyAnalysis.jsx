import { useLocation, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { labels, wpCat } from '../../api/constants';
import { setTitle } from '../../api/helpers';
import { analysisLabels, getAnalysedData } from '../../api/wpHelpers';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';
import AnalysisDetail from '../../components/wp/templates/AnalysisDetail';

function PartyAnalysis() {
    const party = useOutletContext();

    // try to set article data object from location.state
    const location = useLocation();
    let article =
        location.state && (location.state.article ?? false)
            ? location.state.article
            : {};

    // load article data from API (if needed)
    const { isLoading, error, data } = useQuery(
        [`party_analysis_${party[labels.elections.name_key]}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${wpCat.analyses}&tags=${party.tag}&tax_relation=AND`
            ).then((response) => response.json()),
        {
            // run only if article data were not delivered via location.state
            // and only if party has WP tag
            enabled: !(article.title ?? false) && !!(party.tag ?? false),
        }
    );

    if (!isLoading && !error && data && data.length) {
        // article successfully loaded from API - use it!
        article = {
            ...article,
            ...getAnalysedData(data)[0],
        };
    }

    let content = (
        <AlertWithIcon className="my-4" variant="danger">
            {analysisLabels.noData}
        </AlertWithIcon>
    );
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (article.title ?? false) {
        content = <AnalysisDetail article={article} />;
    }

    setTitle(`${party.fullName} : Hodnotenie`);

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default PartyAnalysis;
