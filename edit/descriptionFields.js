import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderPhysicalDescriptions = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-description" onClick={() => fields.push()}>Add Description</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((description, index) =>
      <Row key={index}>
        <Col sm={4} smOffset={1}>
          <Field
            name={description}
            type="text"
            component={TextField}
            label={index === 0 ? 'Description' : null}
          />
        </Col>
        <Col sm={1}>
          { index === 0 ? <br /> : null }
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Description ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Remove</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderPhysicalDescriptions.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderPhysicalDescriptions;
