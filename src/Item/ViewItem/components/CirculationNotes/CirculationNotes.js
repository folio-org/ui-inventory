import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const CirculationNotes = ({ notes }) => {
  if (isEmpty(notes)) {
    return (
      <Row>
        <Col xs={3} data-testid="staff-only-field">
          <KeyValue
            label={<FormattedMessage id="ui-inventory.staffOnly" />}
            value={null}
          />
        </Col>
        <Col xs={9} data-testid="note-field">
          <KeyValue
            label={<FormattedMessage id="ui-inventory.note" />}
            value={null}
          />
        </Col>
      </Row>
    );
  }

  const noteTypes = ['Check out', 'Check in'];

  return noteTypes
    .filter(noteType => notes.find(note => note.noteType === noteType))
    .map((noteType, i) => (
      <Row key={i}>
        <Col xs={3} data-testid="staff-only-field">
          <KeyValue
            label={<FormattedMessage id="ui-inventory.staffOnly" />}
            value={notes.map((note, j) => {
              if (note.noteType === noteType) {
                return <div key={`note-staff-only-${j}`}>{note.staffOnly ? 'Yes' : 'No'}</div>;
              }
              return null;
            })}
          />
        </Col>
        <Col xs={9} data-testid="note-field">
          <KeyValue
            label={`${noteType} note`}
            value={notes.map((note, j) => {
              if (note.noteType === noteType) {
                return <div key={`note-name-${j}`}>{note.note || <NoValue />}</div>;
              }
              return null;
            })}
          />
        </Col>
      </Row>
    ));
};

CirculationNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default CirculationNotes;
