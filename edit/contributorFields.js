import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import { Field } from 'redux-form';

const renderContributors = ({ fields, meta: { touched, error, submitFailed }, contributorTypes }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-contributor" onClick={() => fields.push({})}>Add Contributor</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((contributor, index) => {
      const contributorTypeOptions = contributorTypes.map(
                                        it => ({
                                          label: it.name,
                                          value: it.id,
                                          selected: it.id === contributor.contributorTypeId,
                                        }));
      return (
        <Row key={index}>
          <Col sm={2} smOffset={1}>
            <Field
              name={`${contributor}.name`}
              type="text"
              component={TextField}
              label="Contributor"
            />
          </Col>
          <Col sm={1}>
            <Field
              name={`${contributor}.contributorTypeId`}
              type="text"
              component={Select}
              label="Type"
              dataOptions={[{ label: 'Select contributor name type', value: '' }, ...contributorTypeOptions]}
            />
          </Col>
          <Col sm={1} smOffset={1}>
            <br />
            <Button
              buttonStyle="fullWidth secondary"
              type="button"
              title={`Remove Contributor ${index + 1}`}
              onClick={() => fields.remove(index)}
            >Delete contributor</Button>
          </Col>
        </Row>
      );
    })}
  </div>
);
renderContributors.propTypes = { fields: PropTypes.object, meta: PropTypes.object, contributorTypes: PropTypes.arrayOf(PropTypes.object) };

export default renderContributors;
