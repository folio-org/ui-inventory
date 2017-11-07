import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderSubjects = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-series" onClick={() => fields.push()}>Add Subject</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((subject, index) =>
      <Row key={index}>
        <Col sm={4} smOffset={1}>
          <Field
            name={subject}
            type="text"
            component={TextField}
            label={ index === 0 ? 'Subject' : null }
          />
        </Col>
        <Col sm={1}>
          { index === 0 ? <br /> : null }
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={`Remove Subject ${index + 1}`}
            onClick={() => fields.remove(index)}
          >Remove</Button>
        </Col>
      </Row>,
        // /
     )}
  </div>
);
renderSubjects.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderSubjects;
