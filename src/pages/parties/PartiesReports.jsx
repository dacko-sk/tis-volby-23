import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../api/browserHelpers';
import { labels, t } from '../../api/dictionary';
import { sortByTextProp } from '../../api/helpers';

import useAdsData from '../../context/AdsDataContext';
import useData, { csvAggregatedKeys } from '../../context/DataContext';

import DownloadLink from '../../components/general/DownloadLink';
import Loading from '../../components/general/Loading';

function PartiesReports() {
    const { csvData } = useData();
    const { sheetsData } = useAdsData();

    setTitle(`${t(labels.parties.pageTitle)} - ${t(labels.parties.reports)}`);

    if (!(csvData.data ?? false)) {
        return <Loading />;
    }

    return (
        <Row>
            {csvData.data
                .sort(sortByTextProp(csvAggregatedKeys.name))
                .flatMap((row) =>
                    sheetsData.reports[row.fbName] ?? false
                        ? [
                              <Col
                                  key={row[csvAggregatedKeys.name]}
                                  sm={6}
                                  lg={4}
                              >
                                  <DownloadLink
                                      to={sheetsData.reports[row.fbName]}
                                  >
                                      {(row.logo ?? false) && (
                                          <figure className="party-logo-inline">
                                              <img
                                                  src={row.logo}
                                                  className="party-logo"
                                              />
                                          </figure>
                                      )}

                                      <h3 className="text-secondary my-0">
                                          {row[csvAggregatedKeys.name]}
                                      </h3>
                                  </DownloadLink>
                              </Col>,
                          ]
                        : []
                )}
        </Row>
    );
}

export default PartiesReports;
