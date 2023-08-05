import Col from 'react-bootstrap/Col';
import has from 'has';

import { campaignMetadata as cmd } from '../../../api/constants';
import { badgePctFormat, transparencyClass } from '../../../api/helpers';

import useData from '../../../context/DataContext';

import Media from '../Media';

import defaultImg from '../../../assets/img/user_grey.png';

function AnalysisFeatured({ article, clickHandler, keyUpHandler }) {
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
        <Col md>
            <div
                id={article.slug}
                className={`article analysis-preview score-${cls}${
                    isElected ? ' analysis-elected' : ''
                }`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <div
                    className="thumb mb-2 mb-md-0"
                    data-label={badgePctFormat(analysis[cmd.score][lastCol])}
                >
                    <figure className="text-center">
                        <Media
                            alt={article.title.rendered}
                            id={article.featured_media}
                            fallback={defaultImg}
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
