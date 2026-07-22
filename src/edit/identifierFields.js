import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import {
  Field,
  useForm,
} from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';


import { NumberGeneratorModalButton } from '@folio/service-interaction';
import {
  Row,
  Col,
  Label,
  RepeatableField,
  Select,
  TextField,
} from '@folio/stripes/components';

import {
  IDENTIFIER_SETTING,
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
} from '../settings/NumberGeneratorSettings/constants';

const IdentifierFields = ({
  identifierTypes = [],
  canAdd = true,
  canEdit = true,
  canDelete = true,
  numberGeneratorData,
}) => {
  const { formatMessage } = useIntl();
  const { change } = useForm();

  const identifierTypeOptions = identifierTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const typeLabel = formatMessage({ id: 'ui-inventory.type' });
  const identifierLabel = formatMessage({ id: 'ui-inventory.identifier' });
  const isIdentifierDisabled = numberGeneratorData?.[IDENTIFIER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE;
  const showNumberGeneratorForIdentifier = isIdentifierDisabled ||
      numberGeneratorData?.[IDENTIFIER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_EDITABLE;

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

  const renderField = (field, index) => (
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
          disabled={!canEdit || isIdentifierDisabled}
          required
        />
        {showNumberGeneratorForIdentifier &&
          <NumberGeneratorModalButton
            buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateIdentifier" />}
            callback={(generated) => change(`${field}.value`, generated)}
            id={`number_generator_identifier_${index}`}
            generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateIdentifier" />}
            generator="inventory_instanceIdentifier"
            modalProps={{
              label: <FormattedMessage id="ui-inventory.numberGenerator.generateIdentifier" />
            }}
          />
        }
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
  numberGeneratorData: PropTypes.object,
};

export default IdentifierFields;
