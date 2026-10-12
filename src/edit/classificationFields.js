import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  RepeatableField,
  TextField,
  Select,
  Row,
  Col,
  Label,
} from '@folio/stripes/components';

const ClassificationFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
  classificationTypes = [],
}) => {
  const { formatMessage } = useIntl();

  const classificationTypeOptions = classificationTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const classificationIdTypeLabel = formatMessage({ id: 'ui-inventory.classificationIdentifierType' });
  const classificationLabel = formatMessage({ id: 'ui-inventory.classification' });

  const headLabels = (
    <Row>
      <Col sm={6}>
        <Label tagName="legend" required>
          {classificationIdTypeLabel}
        </Label>
      </Col>
      <Col sm={6}>
        <Label tagName="legend" required>
          {classificationLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={6}>
        <Field
          aria-label={classificationIdTypeLabel}
          name={`${field}.classificationTypeId`}
          component={Select}
          placeholder={formatMessage({ id: 'ui-inventory.selectClassification' })}
          dataOptions={classificationTypeOptions}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={6}>
        <Field
          ariaLabel={classificationLabel}
          name={`${field}.classificationNumber`}
          component={TextField}
          disabled={!canEdit}
          required
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="classifications"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.classification" />}
      addLabel={<FormattedMessage id="ui-inventory.addClassification" />}
      onAdd={fields => fields.push({
        classificationNumber: '',
        classificationTypeId: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

ClassificationFields.propTypes = {
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default ClassificationFields;
