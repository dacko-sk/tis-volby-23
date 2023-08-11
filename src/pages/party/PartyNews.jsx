import { useOutletContext } from 'react-router-dom';

import { labels } from '../../api/constants';
import { setTitle } from '../../api/helpers';
import { wpCat } from '../../api/wpHelpers';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Posts, { templates } from '../../components/wp/Posts';

function PartyNews() {
    const party = useOutletContext();

    const content =
        party.tag ?? false ? (
            <Posts
                categories={[wpCat.news]}
                tags={[party.tag]}
                template={templates.list}
            />
        ) : (
            <AlertWithIcon className="my-4" variant="danger">
                {labels.news.noData}
            </AlertWithIcon>
        );

    setTitle(`${party.fullName} : Aktuality`);

    return <div className="subpage">{content}</div>;
}

export default PartyNews;
