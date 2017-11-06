import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderNotes = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-notes" onClick={() => fields.push({})}>Add Notes</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((note, index) =>
      <Row key={index}>
        <Col sm={2} smOffset={1}>
          <Field
            name={note}
            type="text"
            component={TextField}
            label="Notes"
          />
        </Col>
        <Col sm={1} smOffset={1}>
          <br />
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Notes ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Delete Notes</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderNotes.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderNotes;
