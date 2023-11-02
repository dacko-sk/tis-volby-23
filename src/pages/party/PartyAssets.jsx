import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { setTitle } from '../../api/helpers';
import { analysisLabels, wpCat } from '../../api/wpHelpers';

import { csvAggregatedKeys } from '../../context/DataContext';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';
import AssetsDetail from '../../components/wp/templates/AssetsDetail';

function PartyAssets() {
    const party = useOutletContext();

    let article = {};

    // load article data from API (if needed)
    // isInitialLoading flag will be true if query is enabled, there are no data yet (isLoading) and isFetching
    const { isInitialLoading, error, data } = useQuery(
        [`party_asets_${party[csvAggregatedKeys.name]}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${wpCat.assets}&tags=${party.tag}&tax_relation=AND`
            ).then((response) => response.json()),
        {
            // run only if party has WP tag
            enabled: !!(party.tag ?? false),
        }
    );

    if (!isInitialLoading && !error && data && data.length) {
        // article successfully loaded from API - use it!
        article = {
            ...article,
            ...data[0],
        };
    }

    let content = (
        <AlertWithIcon className="my-4" variant="danger">
            {analysisLabels.noAssets}
        </AlertWithIcon>
    );
    if (isInitialLoading || error) {
        content = <Loading error={error} />;
    } else if (article.title ?? false) {
        content = <AssetsDetail article={article} />;
    }

    setTitle(`${party.fullName} : Majetkové priznania`);

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default PartyAssets;
