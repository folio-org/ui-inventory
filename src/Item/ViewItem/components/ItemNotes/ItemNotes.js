import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';

const ItemNotes = ({
  noteTypes = [],
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

  return noteTypes
    .filter(noteType => notes.find(note => note.itemNoteTypeId === noteType.id))
    .map((noteType, i) => (
      <Row key={i}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.staffOnly" />}
            value={notes.map((note, j) => {
              if (note.itemNoteTypeId === noteType.id) {
                return <div key={`${noteType}-${j}`}>{note.staffOnly ? 'Yes' : 'No'}</div>;
              }
              return null;
            })}
          />
        </Col>
        <Col xs={9}>
          <KeyValue
            label={noteType.name}
            value={notes.map((note, j) => {
              if (note.itemNoteTypeId === noteType.id) {
                return <div key={`${note.id} - ${j}`}>{note.note || <NoValue />}</div>;
              }
              return null;
            })}
          />
        </Col>
      </Row>
    ));
};

ItemNotes.propTypes = {
  noteTypes: PropTypes.arrayOf(PropTypes.object),
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default ItemNotes;
