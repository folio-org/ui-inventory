import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

// const renderNotes = ({ fields, meta: { touched, error, submitFailed } }) => (
//   <div>
//     <Row>
//       <Col sm={2} smOffset={4}>
//         <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-notes" onClick={() => fields.push()}>Add Notes</Button>
//         {(touched || submitFailed) && error && <span>{error}</span>}
//       </Col>
//     </Row>
//     {fields.map((note, index) =>
//       <Row key={index}>
//         <Col sm={4} smOffset={1}>
//           <Field
//             name={note}
//             type="text"
//             component={TextField}
//             label={index === 0 ? 'Notes' : null}
//           />
//         </Col>
//         <Col sm={1}>
//           {index === 0 ? <br /> : ''}
//           <Button
//             buttonStyle="fullWidth secondary"
//             type="button"
//             title={`Remove Notes ${index + 1}`}
//             onClick={() => fields.remove(index)}
//           >Remove</Button>
//         </Col>
//       </Row>,
//         // /
//      )}
//   </div>
// );
// renderNotes.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

// export default renderNotes;

class NoteFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="notes"
        label="Notes"
        addLabel="+ Add note"
        addId="clickable-add-note"
        template={[{
          label: 'Note',
          component: TextField
        }]}
      />
    );
  }
}

export default NoteFields;