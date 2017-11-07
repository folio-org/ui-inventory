import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import { Field } from 'redux-form';

const renderCreators = ({ fields, meta: { touched, error, submitFailed }, creatorTypes }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-creator" onClick={() => fields.push()}>Add Creator</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((creator, index) => {
      const creatorTypeOptions = creatorTypes.map(
                                        it => ({
                                          label: it.name,
                                          value: it.id,
                                          selected: it.id === creator.creatorTypeId,
                                        }));
      return (
        <Row key={index}>
          <Col sm={2} smOffset={1}>
            <Field
              name={`${creator}.name`}
              type="text"
              component={TextField}
              label={ index === 0 ? 'Creator' : null }
            />
          </Col>
          <Col sm={1}>
            <Field
              name={`${creator}.creatorTypeId`}
              type="text"
              component={Select}
              label={ index === 0 ? 'Type of name' : null }
              dataOptions={[{ label: 'Select creator name type', value: '' }, ...creatorTypeOptions]}
            />
          </Col>
          <Col sm={1} smOffset={1}>
            { index === 0 ? <br /> : null }
            <Button
              buttonStyle="fullWidth secondary"
              type="button"
              title={`Remove Creator ${index + 1}`}
              onClick={() => fields.remove(index)}
            >Delete creator</Button>
          </Col>
        </Row>
      );
    })}
  </div>
);
renderCreators.propTypes = { fields: PropTypes.object, meta: PropTypes.object, creatorTypes: PropTypes.arrayOf(PropTypes.object) };

export default renderCreators;
