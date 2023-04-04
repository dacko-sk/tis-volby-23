import has from 'has';
import { Link } from 'react-router-dom';

import { labels, parties } from '../../api/constants';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

function PartyTags({ categories, className }) {
    const { csvData } = useData();

    const tags = [];
    // parse data
    if (has(csvData, 'data')) {
        Object.entries(parties).forEach(([partyName, partyProps]) => {
            if (categories.includes(partyProps.category)) {
                csvData.data.some((row) => {
                    if (partyName === row[labels.elections.name_key]) {
                        tags.push(
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
        if (tags.length) {
            return <div className={className}>{tags}</div>;
        }
    }

    return <></>;
}

export default PartyTags;
