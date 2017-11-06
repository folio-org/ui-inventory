import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderURLs = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-url" onClick={() => fields.push({})}>Add URL</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((url, index) =>
      <Row key={index}>
        <Col sm={2} smOffset={1}>
          <Field
            name={url}
            type="text"
            component={TextField}
            label="URL"
          />
        </Col>
        <Col sm={1} smOffset={1}>
          <br />
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove URL ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Delete URL</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderURLs.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderURLs;
