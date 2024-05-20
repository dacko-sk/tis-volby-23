import { Link } from 'react-router-dom';

import { setTitle } from '../../api/browserHelpers';
import { labels, t } from '../../api/dictionary';
import { sortByTextProp } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData, { csvAggregatedKeys } from '../../context/DataContext';

import Loading from '../../components/general/Loading';

function PartiesList() {
    const { csvData } = useData();

    const links = [];

    if (csvData.data ?? false) {
        csvData.data.sort(sortByTextProp('fullName')).forEach((row) => {
            links.push(
                <div key={row[csvAggregatedKeys.name]}>
                    <Link
                        className="party-logo-link hover-bg d-flex align-items-center"
                        to={routes.party(row[csvAggregatedKeys.name])}
                    >
                        <figure className="party-logo-inline">
                            {(row.logo ?? false) && <img src={row.logo} />}
                        </figure>

                        <h3 className="my-2">{row.fullName}</h3>
                    </Link>
                </div>
            );
        });
    } else {
        return <Loading />;
    }

    setTitle(t(labels.parties.pageTitle));

    return (
        <>
            <p className="mb-4">{t(labels.parties.list)}</p>
            {links}
        </>
    );
}

export default PartiesList;
