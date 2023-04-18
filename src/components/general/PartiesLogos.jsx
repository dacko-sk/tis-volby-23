import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import has from 'has';

import { labels, parties } from '../../api/constants';
import { sortByNumericProp } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import Loading from './Loading';

import './Parties.scss';

function PartiesLogos({ minShare = 2, maxParties = 12 }) {
    const { csvData } = useData();
    const items = [];
    const logos = [];

    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (row.share > minShare) {
                items.push({
                    key: row[labels.elections.name_key],
                    logo: has(row, 'logo') ? (
                        <figure>
                            <img src={row.logo} />
                        </figure>
                    ) : (
                        <h3>{row.slug}</h3>
                    ),
                    share: row.share,
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
                            {item.logo}
                        </Link>
                    </Col>
                );
            });
    } else {
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

            <div className="buttons text-center mt-3">
                <Button as={Link} to={routes.parties} variant="secondary">
                    Zobraziť všetky strany
                </Button>
            </div>
        </div>
    );
}

export default PartiesLogos;
