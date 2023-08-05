import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import has from 'has';

import { analysisLabels } from '../../../api/analysisHelpers';
import { campaignMetadata as cmd, labels } from '../../../api/constants';
import { badgePctFormat, transparencyClass } from '../../../api/helpers';

import useData from '../../../context/DataContext';

import defaultImg from '../../../assets/img/user_grey.png';

function AnalysisList({ article, clickHandler, keyUpHandler }) {
    const { analysis } = article;
    if (has(analysis, 'error')) {
        console.log(analysis.error);
        return null;
    }
    const lastCol = analysis[cmd.score].length - 1;
    if (lastCol < 0) {
        return null;
    }
    const cls = transparencyClass(analysis[cmd.score][lastCol]);

    const { findInCsvData } = useData();
    // find candidate in aggregated data
    const csvRow = findInCsvData(
        article.title.rendered,
        analysis[cmd.municipality][0]
    );
    const isElected =
        csvRow && has(csvRow, 'isElected') ? csvRow.isElected : false;

    return (
        <Col className="px-0" md={12}>
            <div
                id={article.slug}
                className={`article analysis-preview score-${cls}${
                    isElected ? ' analysis-elected' : ''
                } p-3`}
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
                                    src={defaultImg}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title.rendered}</h2>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <th>{labels.municipality}</th>
                                    <td>{analysis[cmd.municipality][0]}</td>
                                </tr>
                                <tr>
                                    <th>{labels.party}</th>
                                    <td>{analysis[cmd.support][0]}</td>
                                </tr>
                                <tr>
                                    <th>{labels.analysis}</th>
                                    <td className="score">
                                        <span
                                            className={`badge me-1 score-${cls}`}
                                        >
                                            {badgePctFormat(
                                                analysis[cmd.score][lastCol]
                                            )}
                                        </span>
                                        {analysisLabels.transparency[cls]}
                                    </td>
                                </tr>
                                <tr className="d-none d-md-table-row">
                                    <th>{labels.analysisDate}</th>
                                    <td>{analysis[cmd.date][lastCol]}</td>
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
