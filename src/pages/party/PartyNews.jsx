import { useOutletContext } from 'react-router-dom';

import { setTitle } from '../../api/helpers';
import { segments } from '../../api/routes';

import Posts, { templates } from '../../components/wp/Posts';
import { newsCategories } from '../News';

function PartyNews() {
    const { party } = useOutletContext();

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
