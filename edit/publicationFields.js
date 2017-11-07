import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderPublication = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-publication" onClick={() => fields.push()}>Add Publication</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((publication, index) =>
      <Row key={index}>
        <Col sm={2} smOffset={1}>
          <Field
            name={`${publication}.publisher`}
            type="text"
            component={TextField}
            label={ index === 0 ? 'Publisher' : null }
          />
        </Col>
        <Col sm={1}>
          <Field
            name={`${publication}.place`}
            type="text"
            component={TextField}
            label={ index === 0 ? 'Place' : null }
          />
        </Col>
        <Col sm={1}>
          <Field
            name={`${publication}.dateOfPublication`}
            type="text"
            component={TextField}
            label={ index === 0 ? 'Date' : null }
          />
        </Col>
        <Col sm={1}>
          { index === 0 ? <br /> : null }
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Publication ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Remove</Button>
        </Col>
      </Row>,
    )}
  </div>
);
renderPublication.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderPublication;
