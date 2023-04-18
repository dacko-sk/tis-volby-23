import { Link } from 'react-router-dom';
import has from 'has';

import { labels } from '../api/constants';
import { setTitle, sortByName } from '../api/helpers';
import { routes } from '../api/routes';

import useData from '../context/DataContext';

import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

import '../components/general/Parties.scss';

const title = 'Strany a hnutia';

function Parties() {
    const { csvData } = useData();

    const links = [];

    if (has(csvData, 'data')) {
        csvData.data.sort(sortByName).forEach((row) => {
            links.push(
                <div
                    className="party-link"
                    key={row[labels.elections.name_key]}
                >
                    <Link
                        className="party-logo hover-bg d-flex align-items-center"
                        to={routes.party(row[labels.elections.name_key])}
                    >
                        <figure className="flex-shrink-0 me-3">
                            {has(row, 'logo') && <img src={row.logo} />}
                        </figure>

                        <h3 className="my-2">{row.fullName}</h3>
                    </Link>
                </div>
            );
        });
    } else {
        return <Loading />;
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <p className="mb-4">
                Abecedný zoznam všetkých subjektov s transparentným účtom.
            </p>
            {links}
        </section>
    );
}

export default Parties;
