import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const Condition = ({ condition }) => {
  return (
    <Accordion
      id="acc04"
      label={<FormattedMessage id="ui-inventory.condition" />}
    >
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.numberOfMissingPieces" />}
            value={condition.numberOfMissingPieces}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.missingPieces" />}
            value={condition.missingPieces}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.date" />}
            value={condition.missingPiecesDate}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
            value={condition.itemDamagedStatus}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.date" />}
            value={condition.itemDamagedStatusDate}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Condition.propTypes = {
  condition: PropTypes.object.isRequired,
};

export default Condition;
