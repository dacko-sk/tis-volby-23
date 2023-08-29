import { Col, Row } from 'react-bootstrap';

import { labels } from '../../api/constants';
import { currencyFormat, fixNumber } from '../../api/helpers';

import useAdsData, { sheetsConfig } from '../../context/AdsDataContext';

import LastUpdateTag from '../general/LastUpdateTag';
import Loading from '../general/Loading';

function TotalAdsSpending() {
    const { sheetsData, mergedWeeksData } = useAdsData();

    // parse data
    let totalMeta = 0;
    let totalGoogle = 0;
    if (sheetsData.lastUpdateFb) {
        Object.values(mergedWeeksData).forEach((pageData) => {
            totalMeta += pageData.outgoing;
        });
    }
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            totalGoogle += fixNumber(
                pageData[sheetsConfig.GOOGLE.columns.SPENDING]
            );
        });
    }

    return (
        <div className="total-spending mt-4">
            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <h2>{labels.ads.meta.totalSpendingTitle}</h2>
                    <div className="hero-number">
                        {sheetsData.lastUpdateFb ? (
                            currencyFormat(totalMeta)
                        ) : (
                            <Loading small />
                        )}
                        <LastUpdateTag
                            timestamp={sheetsData.lastUpdateFb || null}
                        >
                            {labels.ads.meta.totalDisclaimer}
                        </LastUpdateTag>
                    </div>
                </Col>
                <Col lg={6}>
                    <h2>{labels.ads.google.totalSpendingTitle}</h2>
                    <div className="hero-number">
                        {sheetsData.lastUpdateGgl ? (
                            currencyFormat(totalGoogle)
                        ) : (
                            <Loading small />
                        )}
                        <LastUpdateTag
                            timestamp={sheetsData.lastUpdateGgl || null}
                        >
                            {labels.ads.google.totalDisclaimer}
                        </LastUpdateTag>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default TotalAdsSpending;
