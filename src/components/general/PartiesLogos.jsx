import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import has from 'has';

import { labels, parties } from '../../api/constants';
import { sortByNumericProp } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import Loading from './Loading';

import './PartiesLogos.scss';

function PartiesLogos({ minShare = 2, maxParties = 12 }) {
    const { csvData } = useData();
    const items = [];
    const logos = [];

    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (
                has(parties, row[labels.elections.name_key]) &&
                has(parties[row[labels.elections.name_key]], 'logo') &&
                parties[row[labels.elections.name_key]].share > minShare
            ) {
                items.push({
                    key: row[labels.elections.name_key],
                    logo: parties[row[labels.elections.name_key]].logo,
                    share: parties[row[labels.elections.name_key]].share,
                });
            }
        });
        items
            .sort(sortByNumericProp('share'))
            .slice(0, maxParties)
            .forEach((item) => {
                logos.push(
                    <Col xs={4} md={3} xl={2} key={item.key}>
                        <Link
                            to={routes.party(item.key)}
                            className="party-logo d-flex align-items-center justify-content-center h-100"
                        >
                            <figure>
                                <img src={item.logo} />
                            </figure>
                        </Link>
                    </Col>
                );
            });
    }

    if (!has(csvData, 'data')) {
        return <Loading />;
    }

    return (
        <div className="logos mb-4">
            <h2 className="text-center mb-4">Kandidujúce strany a hnutia</h2>
            <Row className="gx-3 gx-sm-5 gy-3 mb-2">{logos}</Row>
            <em className="disclaimer">
                Zobrazujeme len logá {maxParties} preferenčne najsilnejších
                strán, u ktorých evidujeme transparentný účet. Zoznam všetkých
                strán nájdete na podstránke Strany. Posledná aktualizácia: AKO,
                13. apríla 2023.
            </em>
        </div>
    );
}

export default PartiesLogos;
