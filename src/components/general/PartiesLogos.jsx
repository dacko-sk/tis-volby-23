import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import has from 'has';

import { labels } from '../../api/constants';
import { sortByNumericProp } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import Loading from './Loading';

import './Parties.scss';

function PartiesLogos({ minShare = 3 }) {
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
        items.sort(sortByNumericProp('share')).forEach((item) => {
            logos.push(
                <Col xs={4} sm="auto" key={item.key}>
                    <Link
                        to={routes.party(item.key)}
                        className="party-logo-link d-flex align-items-center justify-content-center h-100"
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
            <Row className="gx-3 gx-sm-5 gy-3 justify-content-evenly mb-3">
                {logos}
            </Row>
            <em className="disclaimer text-center">
                Na úvodnej stránke sú logá strán, ktoré vo viac ako jednom
                prieskume relevantných agentúr dosiahli za posledné obdobie cez
                3%. <br className="d-none d-lg-block" />
                Zoznam všetkých strán nájdete na podstránke Strany. Posledná
                aktualizácia: 13. apríla 2023.
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
