import Col from 'react-bootstrap/Col';

import { badgePctFormat } from '../../../api/helpers';
import {
    analysisLabels,
    metaData as cmd,
    transparencyClass,
} from '../../../api/wpHelpers';

import useData from '../../../context/DataContext';

function AnalysisFeatured({ article, clickHandler, keyUpHandler }) {
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
        <Col md>
            <div
                id={article.slug}
                className={`article analysis-preview score-${cls}`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <div
                    className="thumb mb-2 mb-md-0"
                    data-label={badgePctFormat(analysis.lastScore)}
                >
                    <figure className="text-center">
                        <img
                            alt={analysisLabels.transparency[cls]}
                            className="p-3"
                            src={party.logo}
                        />
                    </figure>
                    <div className="name text-center">
                        <span className="badge">{article.title.rendered}</span>
                    </div>
                </div>
            </div>
        </Col>
    );
}

export default AnalysisFeatured;
