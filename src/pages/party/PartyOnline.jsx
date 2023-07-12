import { useOutletContext } from 'react-router-dom';

import { labels } from '../../api/constants';
import { setTitle } from '../../api/helpers';

import PartyGoogle from './PartyGoogle';
import PartyMeta from './PartyMeta';

function PartyOnline() {
    const party = useOutletContext();

    setTitle(`${party.fullName} : Online`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{labels.ads.meta.title}</h2>
            <PartyMeta />
            <h2 className="mt-4 mb-3">{labels.ads.google.title}</h2>
            <PartyGoogle />
        </div>
    );
}

export default PartyOnline;
