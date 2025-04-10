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

const IdentifierFields = ({
  identifierTypes = [],
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const identifierTypeOptions = identifierTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const typeLabel = formatMessage({ id: 'ui-inventory.type' });
  const identifierLabel = formatMessage({ id: 'ui-inventory.identifier' });

  const headLabels = (
    <Row>
      <Col sm={6}>
        <Label tagName="legend" required>
          {typeLabel}
        </Label>
      </Col>
      <Col sm={6}>
        <Label tagName="legend" required>
          {identifierLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={6}>
        <Field
          aria-label={typeLabel}
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
          ariaLabel={identifierLabel}
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

export default IdentifierFields;
