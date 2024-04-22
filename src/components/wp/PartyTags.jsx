import { Link, useParams } from 'react-router-dom';

import { parties } from '../../api/constants';
import { decodeSlug, routes } from '../../api/routes';

import useData, { csvAggregatedKeys } from '../../context/DataContext';

function PartyTags({ tags, className, link }) {
    const { csvData } = useData();
    const { slug } = useParams();
    const currentParty = slug ? decodeSlug(slug) : null;

    const items = [];
    // parse data
    if (csvData.data ?? false) {
        Object.entries(parties).forEach(([partyKey, partyProps]) => {
            if (tags.includes(partyProps.tag)) {
                csvData.data.some((row) => {
                    if (partyKey === row[csvAggregatedKeys.name]) {
                        const tagName = partyProps.slug ?? partyKey;
                        const tag =
                            currentParty === tagName ? (
                                <strong>{tagName}</strong>
                            ) : (
                                tagName
                            );
                        items.push(
                            link ? (
                                <Link
                                    className="tag"
                                    key={partyKey}
                                    to={routes.party(tagName)}
                                >
                                    {tag}
                                </Link>
                            ) : (
                                <span className="tag" key={partyKey}>
                                    {tag}
                                </span>
                            )
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
