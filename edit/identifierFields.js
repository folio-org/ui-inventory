import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import { Field } from 'redux-form';

const renderIdentifiers = ({ fields, meta: { touched, error, submitFailed }, identifierTypes }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-identifier" onClick={() => fields.push({})}>Add Identifier</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((identifier, index) => {
      const identifierTypeOptions = identifierTypes.map(
                                        it => ({
                                          label: it.name,
                                          value: it.id,
                                          selected: it.id === identifier.identifierTypeId,
                                        }));
      return (
        <Row key={index}>
          <Col sm={2} smOffset={1}>
            <Field
              name={`${identifier}.value`}
              type="text"
              component={TextField}
              label="Identifier"
            />
          </Col>
          <Col sm={1}>
            <Field
              name={`${identifier}.identifierTypeId`}
              type="text"
              component={Select}
              label="Type"
              dataOptions={[{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions]}
            />
          </Col>
          <Col sm={1} smOffset={1}>
            <br />
            <Button
              buttonStyle="fullWidth secondary"
              type="button"
              title={`Remove Identifier ${index + 1}`}
              onClick={() => fields.remove(index)}
            >Delete identifier</Button>
          </Col>
        </Row>
      );
    })}
  </div>
);
renderIdentifiers.propTypes = { fields: PropTypes.object, meta: PropTypes.object, identifierTypes: PropTypes.arrayOf(PropTypes.object) };

export default renderIdentifiers;
