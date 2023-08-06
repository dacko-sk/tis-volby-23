import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import {
    analysisLabels,
    campaignMetadata as cmd,
    parseAnalysisData,
    transparencyClass,
    transparencyClasses,
    transparencyIndicators,
} from '../../../api/analysisHelpers';
import { badgePctFormat, parseWpHtml } from '../../../api/helpers';

function AnalysisDetail({ article }) {
    const analysis =
        article.analysis ?? parseAnalysisData(article.content.rendered);
    if (analysis.error ?? false) {
        console.log(analysis.error);
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }

    const lastCol = analysis[cmd.score].length - 1;
    if (lastCol < 0) {
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }
    const lastClass = transparencyClass(analysis[cmd.score][lastCol]);
    const words = analysisLabels.transparency[lastClass].split(' ');
    const lastLabel = [];
    words.forEach((word, index) => {
        if (index < words.length - 1) {
            lastLabel.push(`${word} `);
            lastLabel.push(<br className="d-none d-sm-block" key={word} />);
        } else {
            lastLabel.push(word);
        }
    });

    let headerRow = null;
    let historyTable = null;
    if (lastCol > 0) {
        const headers = [<th key="title">{analysisLabels.date}</th>];
        const ratings = [<td key="ratings">{analysisLabels.total}</td>];
        analysis[cmd.date].forEach((date, di) => {
            headers.push(<th key={date}>{date}</th>);
            const cls = transparencyClass(analysis[cmd.score][di]);
            ratings.push(
                <td key={date}>
                    <span className={`badge me-1 score-${cls}`}>
                        {badgePctFormat(analysis[cmd.score][di])}
                    </span>
                </td>
            );
        });
        headerRow = <tr key="header">{headers}</tr>;
        historyTable = (
            <>
                <h2 className="mt-4 mb-3">{analysisLabels.history}</h2>
                <Table
                    key="scores"
                    className="indicators-table mb-0"
                    striped
                    bordered
                    responsive
                    hover
                >
                    <thead>{headerRow}</thead>
                    <tbody>
                        <tr>{ratings}</tr>
                    </tbody>
                </Table>
            </>
        );
    }

    const groups = {};
    Object.keys(transparencyIndicators).forEach((group) => {
        groups[group] = [];
        Object.entries(analysis[group]).forEach(([key, valuesArray]) => {
            const cols = [<td key={key}>{key}</td>];
            valuesArray.forEach((value, vi) => {
                let color = '';
                switch (value) {
                    case 1:
                        color = transparencyClasses.good;
                        break;
                    case 2:
                        color = transparencyClasses.average;
                        break;
                    case 3:
                        color = transparencyClasses.bad;
                        break;
                    default:
                        break;
                }
                const vk = `${vi}_${value}`;
                cols.push(
                    <td key={vk}>
                        {Number(value) > -1 && (
                            <span
                                className={`badge${
                                    color ? ` score-${color}` : ''
                                }`}
                            >
                                {analysisLabels.score[value]}
                            </span>
                        )}
                    </td>
                );
            });
            groups[group].push(<tr key={key}>{cols}</tr>);
        });
    });

    const tables = [];
    Object.keys(groups).forEach((group) => {
        tables.push(
            <h2 key={`${group}title`} className="mt-4 mb-3">
                {analysisLabels.indicators[group].title}
            </h2>
        );
        tables.push(
            <Table
                key={group}
                className="indicators-table mb-0"
                striped
                bordered
                responsive
                hover
            >
                {headerRow && <thead>{headerRow}</thead>}
                <tbody>{groups[group]}</tbody>
            </Table>
        );
    });

    return (
        <div className="analysis">
            <div className="row gy-3 gy-lg-0">
                <div className="col-lg-6">
                    <h2 className="text-lg-center">{analysisLabels.meta}</h2>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <th>{analysisLabels.party}</th>
                                <td className="text-end">
                                    {analysis[cmd.party][0]}
                                </td>
                            </tr>
                            <tr>
                                <th>{analysisLabels.leader}</th>
                                <td className="text-end">
                                    {analysis[cmd.leader][0]}
                                </td>
                            </tr>
                            <tr>
                                <th>{analysisLabels.date}</th>
                                <td className="text-end">
                                    {analysis[cmd.date][lastCol]}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="col-lg-6">
                    <h2 className="text-lg-center">{analysisLabels.total}</h2>
                    <Row className="hero-number justify-content-lg-center align-items-center mt-4 gx-2">
                        <Col xs="auto">
                            <span className={`badge me-1 score-${lastClass}`}>
                                {badgePctFormat(analysis[cmd.score][lastCol])}
                            </span>
                        </Col>
                        <Col xs="auto">
                            <h5>{lastLabel}</h5>
                        </Col>
                    </Row>
                </div>
            </div>

            {historyTable}

            {tables}
        </div>
    );
}

export default AnalysisDetail;
