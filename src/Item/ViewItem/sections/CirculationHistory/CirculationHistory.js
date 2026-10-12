import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const CirculationHistory = ({ circulationHistory }) => {
  return (
    <Accordion
      id="acc09"
      label={<FormattedMessage id="ui-inventory.circulationHistory" />}
    >
      <Row>
        <Col xs={12}>
          <Headline>
            <FormattedMessage id="ui-inventory.mostRecentCheckIn" />
          </Headline>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.checkInDate" />}
            value={circulationHistory.checkInDate}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.servicePoint" />}
            value={circulationHistory.servicePointName}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.source" />}
            value={circulationHistory.source}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

CirculationHistory.propTypes = {
  circulationHistory: PropTypes.object.isRequired,
};

export default CirculationHistory;
