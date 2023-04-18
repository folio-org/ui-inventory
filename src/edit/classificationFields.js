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

const ClassificationFields = props => {
  const { formatMessage } = useIntl();

  const {
    classificationTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const classificationTypeOptions = classificationTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const headLabels = (
    <Row>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.classificationIdentifierType" />
        </Label>
      </Col>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.classification" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={6}>
        <Field
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
ClassificationFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ClassificationFields;
