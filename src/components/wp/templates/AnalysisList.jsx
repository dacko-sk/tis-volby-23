import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { badgePctFormat } from '../../../api/helpers';
import {
    analysisLabels,
    baseData as cbd,
    metaData as cmd,
    transparencyClass,
} from '../../../api/wpHelpers';

import useData from '../../../context/DataContext';

function AnalysisList({ article, clickHandler, keyUpHandler }) {
    const { analysis } = article;
    if (analysis.error ?? false) {
        console.log(analysis.error);
        return null;
    }
    if (analysis.lastCol < 0) {
        return null;
    }
    const cls = transparencyClass(analysis.lastScore);

    const { findPartyByWpTags } = useData();
    const party = findPartyByWpTags(article.tags);
    const logo =
        party && (party.logo ?? false) ? (
            <img
                alt={analysisLabels.transparency[cls]}
                className="p-3"
                src={party.logo}
            />
        ) : null;
    const name =
        party && (party.fullName ?? false)
            ? party.fullName
            : article.title.rendered;

    return (
        <Col md={12}>
            <div
                id={article.slug}
                className={`article hover-bg analysis-preview score-${cls}`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <Row className="align-items-center">
                    <Col sm>
                        <div
                            className="thumb mb-2 mb-md-0"
                            data-label={analysisLabels.transparencyShort[cls]}
                        >
                            <figure className="text-center text-xxl-start">
                                {logo}
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{name}</h2>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <th>{analysisLabels[cmd.leader]}</th>
                                    <td>{analysis.meta[cmd.leader]}</td>
                                </tr>
                                <tr>
                                    <th>{analysisLabels[cbd.score]}</th>
                                    <td className="score">
                                        <span
                                            className={`badge me-1 score-${cls}`}
                                        >
                                            {badgePctFormat(analysis.lastScore)}
                                        </span>
                                        {analysisLabels.transparency[cls]}
                                    </td>
                                </tr>
                                <tr className="d-none d-sm-table-row">
                                    <th>{analysisLabels[cbd.date]}</th>
                                    <td>
                                        {
                                            analysis.base[cbd.date][
                                                analysis.lastColumn
                                            ]
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default AnalysisList;
