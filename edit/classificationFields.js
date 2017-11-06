import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import { Field } from 'redux-form';

const renderClassifications = ({ fields, meta: { touched, error, submitFailed }, classificationTypes }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-classification" onClick={() => fields.push({})}>Add Classification</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((classification, index) => {
      const classificationTypeOptions = classificationTypes.map(
                                        it => ({
                                          label: it.name,
                                          value: it.id,
                                          selected: it.id === classification.classificationTypeId,
                                        }));
      return (
        <Row key={index}>
          <Col sm={2} smOffset={1}>
            <Field
              name={`${classification}.classificationNumber`}
              type="text"
              component={TextField}
              label="Classification"
            />
          </Col>
          <Col sm={1}>
            <Field
              name={`${classification}.classificationTypeId`}
              type="text"
              component={Select}
              label="Type"
              dataOptions={[{ label: 'Select classification type', value: '' }, ...classificationTypeOptions]}
            />
          </Col>
          <Col sm={1} smOffset={1}>
            <br />
            <Button
              buttonStyle="fullWidth secondary"
              type="button"
              title={`Remove Classification ${index + 1}`}
              onClick={() => fields.remove(index)}
            >Delete classification</Button>
          </Col>
        </Row>
      );
    })}
  </div>
);
renderClassifications.propTypes = { fields: PropTypes.object, meta: PropTypes.object, classificationTypes: PropTypes.arrayOf(PropTypes.object) };

export default renderClassifications;
