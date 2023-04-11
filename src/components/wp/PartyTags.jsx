import has from 'has';
import { Link } from 'react-router-dom';

import { labels, parties } from '../../api/constants';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

function PartyTags({ tags, className }) {
    const { csvData } = useData();

    const items = [];
    // parse data
    if (has(csvData, 'data')) {
        Object.entries(parties).forEach(([partyName, partyProps]) => {
            if (tags.includes(partyProps.tag)) {
                csvData.data.some((row) => {
                    if (partyName === row[labels.elections.name_key]) {
                        items.push(
                            <Link key={partyName} to={routes.party(partyName)}>
                                {partyName}
                            </Link>
                        );
                        return true;
                    }
                    return false;
                });
            }
        });
        if (items.length) {
            return <div className={className}>{items}</div>;
        }
    }

    return <></>;
}

export default PartyTags;
