import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  convertArrayToBlocks,
} from '../../../../utils';

const EnumerationData = ({ enumerationData }) => {
  return (
    <Accordion
      id="acc03"
      label={<FormattedMessage id="ui-inventory.enumerationData" />}
    >
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.displaySummary" />}
            value={enumerationData.displaySummary}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.enumeration" />}
            value={enumerationData.enumeration}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.chronology" />}
            value={enumerationData.chronology}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.volume" />}
            value={enumerationData.volume}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.yearCaption" />}
            value={convertArrayToBlocks(enumerationData.yearCaption)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

EnumerationData.propTypes = {
  enumerationData: PropTypes.object.isRequired,
};

export default EnumerationData;
