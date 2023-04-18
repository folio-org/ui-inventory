import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Row,
  Col,
  Label,
  RepeatableField,
  Select,
  TextField,
} from '@folio/stripes/components';

const IdentifierFields = props => {
  const {
    identifierTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const { formatMessage } = useIntl();

  const identifierTypeOptions = identifierTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const headLabels = (
    <Row>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.type" />
        </Label>
      </Col>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.identifier" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={6}>
        <Field
          name={`${field}.identifierTypeId`}
          component={Select}
          placeholder={formatMessage({ id: 'ui-inventory.selectIdentifierType' })}
          dataOptions={identifierTypeOptions}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={6}>
        <Field
          name={`${field}.value`}
          component={TextField}
          disabled={!canEdit}
          required
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="identifiers"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.identifiers" />}
      addLabel={<FormattedMessage id="ui-inventory.addIdentifier" />}
      onAdd={fields => fields.push({ identifierTypeId: '', value: '' })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

IdentifierFields.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
IdentifierFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default IdentifierFields;
