import { Col, Row } from 'react-bootstrap';

import { labels } from '../../api/constants';
import { currencyFormat, wholeNumFormat } from '../../api/helpers';

import useAdsData from '../../context/AdsDataContext';

import LastUpdateTag from '../general/LastUpdateTag';
import Loading from '../general/Loading';

function TotalAdsSpending() {
    const { metaApiData, sheetsData, mergedWeeksData } = useAdsData();

    // parse data
    let total = 0;
    if (sheetsData.lastUpdate) {
        Object.values(mergedWeeksData).forEach((pageProps) => {
            total += pageProps.outgoing > 0 ? pageProps.outgoing : 0;
        });
    }
    let num = 0;
    if (metaApiData.lastUpdate) {
        Object.values(metaApiData.pages).forEach((pageProps) => {
            num += pageProps.ads > 0 ? pageProps.ads : 0;
        });
    }

    return (
        <div className="total-spending">
            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <h2>Výdavky na online reklamu</h2>
                    <div className="hero-number">
                        {sheetsData.lastUpdate ? (
                            currencyFormat(total)
                        ) : (
                            <Loading small />
                        )}
                        <LastUpdateTag
                            timestamp={sheetsData.lastUpdate || null}
                        >
                            {labels.ads.totalDisclaimer}
                        </LastUpdateTag>
                    </div>
                </Col>
                <Col lg={6}>
                    <h2>Počet online reklám</h2>

                    <div className="hero-number">
                        {metaApiData.lastUpdate ? (
                            wholeNumFormat(num)
                        ) : (
                            <Loading small />
                        )}
                        <LastUpdateTag
                            timestamp={metaApiData.lastUpdate || null}
                        >
                            {labels.ads.totalAmountDisclaimer}
                        </LastUpdateTag>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default TotalAdsSpending;
