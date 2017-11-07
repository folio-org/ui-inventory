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
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-url" onClick={() => fields.push()}>Add URL</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((url, index) =>
      <Row key={index}>
        <Col sm={4} smOffset={1}>
          <Field
            name={url}
            type="text"
            component={TextField}
            label={index === 0 ? 'URL' : null}
          />
        </Col>
        <Col sm={1} >
          { index === 0 ? <br /> : null }
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove URL ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Remove</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderURLs.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderURLs;
