import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderAlternativeTitles = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-alt-title" onClick={() => fields.push({})}>Add Alternative Title</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((alternativeTitle, index) =>
      <Row key={index}>
        <Col sm={2} smOffset={1}>
          <Field
            name={`${alternativeTitle}`}
            type="text"
            component={TextField}
            label="Alternative title"
          />
        </Col>
        <Col sm={1} smOffset={1}>
          <br />
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Alternative Title ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Delete Alternative Title</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderAlternativeTitles.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderAlternativeTitles;
