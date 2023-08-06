import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import {
    analysisLabels,
    baseData as cbd,
    metaData as cmd,
    parseAnalysisData,
    transparencyClass,
    transparencyClasses,
    transparencyIndicators,
} from '../../../api/analysisHelpers';
import { badgePctFormat, fixUrl, parseWpHtml } from '../../../api/helpers';
import { routes, segments } from '../../../api/routes';

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

    if (analysis.lastColumn < 0) {
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }
    const lastClass = transparencyClass(analysis.lastScore);
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
    if (analysis.lastColumn > 0) {
        const headers = [<th key="title">{analysisLabels[cbd.date]}</th>];
        const ratings = [<td key="ratings">{analysisLabels[cbd.score]}</td>];
        analysis.base[cbd.date].forEach((date, di) => {
            headers.push(<th key={date}>{date}</th>);
            const cls = transparencyClass(analysis.base[cbd.score][di]);
            ratings.push(
                <td key={date}>
                    <span className={`badge me-1 score-${cls}`}>
                        {badgePctFormat(analysis.base[cbd.score][di])}
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
                                {analysisLabels.badges[value]}
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
                                <th>{analysisLabels[cmd.party]}</th>
                                <td className="text-end">
                                    {analysis.meta[cmd.party]}
                                </td>
                            </tr>
                            <tr>
                                <th>{analysisLabels[cmd.leader]}</th>
                                <td className="text-end">
                                    {analysis.meta[cmd.leader]}
                                </td>
                            </tr>
                            <tr>
                                <th>{analysisLabels[cbd.date]}</th>
                                <td className="text-end">
                                    {
                                        analysis.base[cbd.date][
                                            analysis.lastColumn
                                        ]
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="col-lg-6">
                    <h2 className="text-lg-center">
                        {analysisLabels[cbd.score]}
                    </h2>
                    <Row className="hero-number justify-content-lg-center align-items-center mt-4 gx-2">
                        <Col xs="auto">
                            <span className={`badge me-1 score-${lastClass}`}>
                                {badgePctFormat(
                                    analysis.base[cbd.score][
                                        analysis.lastColumn
                                    ]
                                )}
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

            <h2 className="mt-4 mb-3">{analysisLabels.references}</h2>
            <Row className="mb-4">
                {analysis.meta[cmd.fb] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis.meta[cmd.fb])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {analysisLabels[cmd.fb]}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                {analysis.meta[cmd.web] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis.meta[cmd.web])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {analysisLabels[cmd.web]}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                <Col sm={12} md="auto">
                    <ul className="arrows">
                        <li>
                            <Link
                                to={routes.article(
                                    segments.NEWS,
                                    'hodnotenie-kampani-pred-parlamentnymi-volbami-2023'
                                )}
                            >
                                {analysisLabels.methodology}
                            </Link>
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default AnalysisDetail;
