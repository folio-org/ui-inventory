import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';

const renderNotes = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={5}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-notes" onClick={() => fields.push()}>Add Notes</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((note, index) =>
      <Row key={index}>
        <Col sm={6}>
          <Field
            name={note}
            type="text"
            component={TextField}
            label={index === 0 ? 'Notes' : null}
          />
        </Col>
        <Col sm={1}>
          {index === 0 ? <br /> : ''}
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Notes ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Remove
          </Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderNotes.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderNotes;
