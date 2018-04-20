import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';

const renderStatements = ({ fields, meta: { touched, error, submitFailed }, formatMsg }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-statement" onClick={() => fields.push()}>Add Holdings Statement</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((statement, index) =>
      <Row key={index}>
        <Col sm={5} smOffset={1}>
          <Field
            name={statement}
            type="text"
            component={TextField}
            label={index === 0 ? formatMsg({id: 'ui-inventory.holdingsStatement'}) : null}
          />
        </Col>
        <Col sm={1}>
          {index === 0 ? <br /> : null}
          <Button
            buttonStyle="fullWidth secondary"
            type="button"
            title={formatMsg({ 'id': 'ui-inventory.removeStatement' }, { num: index + 1 })}
            onClick={() => fields.remove(index)}
          >{formatMsg({ 'id': 'ui-inventory.deleteStatement' })}
          </Button>
        </Col>
      </Row>)}
  </div>
);
renderStatements.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderStatements;
