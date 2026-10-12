import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';

const ItemNotes = ({
  notes = [],
}) => {
  if (isEmpty(notes)) {
    return (
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.staffOnly" />}
            value={null}
          />
        </Col>
        <Col xs={9}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.note" />}
            value={null}
          />
        </Col>
      </Row>
    );
  }

  return notes.map(({ staffOnly, noteType }, i) => (
    <Row key={i}>
      <Col xs={3}>
        <KeyValue
          label={staffOnly.label}
          value={staffOnly.value}
        />
      </Col>
      <Col xs={9}>
        <KeyValue
          label={noteType.label}
          value={noteType.value}
        />
      </Col>
    </Row>
  ));
};

ItemNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default ItemNotes;
