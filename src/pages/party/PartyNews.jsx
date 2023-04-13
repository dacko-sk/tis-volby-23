import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import has from 'has';

import { setTitle } from '../../api/helpers';
import { routes, segments } from '../../api/routes';

import Posts, { templates } from '../../components/wp/Posts';
import { newsCategories } from '../News';

function PartyNews() {
    const party = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (has(party, 'slug') && !has(party, 'tag')) {
            // redirect to party landing page in case party does not have news tag
            navigate(routes.party(party.slug));
        }
    }, [party]);

    setTitle(`${party.name} : Aktuality`);

    return (
        <div className="subpage">
            <Posts
                categories={newsCategories}
                section={segments.NEWS}
                tags={[party.tag]}
                template={templates.list}
            />
        </div>
    );
}

export default PartyNews;
