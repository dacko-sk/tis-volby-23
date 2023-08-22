import Col from 'react-bootstrap/Col';

import { badgePctFormat } from '../../../api/helpers';
import { analysisLabels, transparencyClass } from '../../../api/wpHelpers';

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

    const { findPartyByWpTags } = useData();
    const party = findPartyByWpTags(article.tags);
    let logo = null;
    let name = null;
    if (party && (party.logo ?? false)) {
        logo = (
            <img
                alt={analysisLabels.transparency[cls]}
                className="p-3"
                src={party.logo}
            />
        );
    } else {
        name = (
            <div className="name text-center">
                <span className="badge">{article.title.rendered}</span>
            </div>
        );
    }

    return (
        <Col>
            <div
                id={article.slug}
                className={`article analysis-preview score-${cls}`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <div
                    className="thumb"
                    data-label={badgePctFormat(analysis.lastScore)}
                >
                    <figure className="text-center">{logo}</figure>
                    {name}
                </div>
            </div>
        </Col>
    );
}

export default AnalysisFeatured;
