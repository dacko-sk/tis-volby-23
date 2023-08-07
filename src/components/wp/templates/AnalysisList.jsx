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

    const { findInCsvData } = useData();
    // TODO: get party logo by article tag
    const csvRow = findInCsvData(
        article.title.rendered,
        analysis[cmd.municipality][0]
    );

    return (
        <Col className="px-0" md={12}>
            <div
                id={article.slug}
                className={`article analysis-preview score-${cls} p-3`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <Row className="align-items-center">
                    <Col sm={4} md={5} lg={3}>
                        <div
                            className="thumb mb-2 mb-md-0"
                            data-label={analysisLabels.transparencyShort[cls]}
                        >
                            <figure className="text-center">
                                <img
                                    alt={analysisLabels.transparency[cls]}
                                    className="p-3"
                                    src={party.logo}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title.rendered}</h2>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <th>{analysisLabels[cmd.party]}</th>
                                    <td>{analysis.meta[cmd.party]}</td>
                                </tr>
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
                                <tr className="d-none d-md-table-row">
                                    <th>{analysisLabels[cbd.date]}</th>
                                    <td>
                                        {
                                            analysis.base[cbd.date][
                                                analysis.lastCol
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
