import { Link } from 'react-router-dom';

import { labels, t } from '../api/dictionary';
import { setTitle, sortByTextProp } from '../api/helpers';
import { routes } from '../api/routes';

import useData, { csvAggregatedKeys } from '../context/DataContext';

import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

import '../components/general/Parties.scss';

function Parties() {
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
                        <figure className="flex-shrink-0 me-3">
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
        <section>
            <Title>{t(labels.parties.pageTitle)}</Title>
            <p className="mb-4">{t(labels.parties.list)}</p>
            {links}
        </section>
    );
}

export default Parties;
