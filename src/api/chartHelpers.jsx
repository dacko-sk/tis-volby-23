import { Link } from 'react-router-dom';

import { routes, separators } from './routes';

export const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    return <strong>{parts.length ? parts[0] : value}</strong>;
};

export const tickLabel = (value) => {
    const parts = value.split(separators.newline);
    return parts.length > 1 ? (
        <Link to={routes.party(parts[0])}>{parts[0]}</Link>
    ) : (
        value
    );
};
