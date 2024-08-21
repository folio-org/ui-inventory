import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Label,
  RepeatableField,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

const SubjectFields = ({
  subjectSources,
  subjectTypes,
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const subjectSourcesOptions = subjectSources.map(it => ({
    label: it.name,
    value: it.id,
  }));
  const subjectTypesOptions = subjectTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const subjectsLabel = formatMessage({ id: 'ui-inventory.subjects' });
  const subjectSourceLabel = formatMessage({ id: 'ui-inventory.subjectSource' });
  const subjectTypeLabel = formatMessage({ id: 'ui-inventory.subjectType' });

  const headLabels = (
    <Row>
      <Col sm={4}>
        <Label tagName="legend">
          {subjectsLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {subjectSourceLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {subjectTypeLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => {
    return (
      <Row>
        <Col sm={4}>
          <Field
            ariaLabel={subjectsLabel}
            name={`${field}.value`}
            component={TextField}
            disabled={!canEdit}
          />
        </Col>
        <Col sm={4}>
          <Field
            ariaLabel={subjectSourceLabel}
            name={`${field}.source`} //change
            component={Select}
            dataOptions={subjectSourcesOptions}
            placeholder={formatMessage({ id: 'ui-inventory.subjectSource.placeholder' })}
            disabled={!canEdit}
          />
        </Col>
        <Col sm={4}>
          <Field
            ariaLabel={subjectTypeLabel}
            name={`${field}.type`} //change
            component={Select}
            dataOptions={subjectTypesOptions}
            placeholder={formatMessage({ id: 'ui-inventory.subjectType.placeholder' })}
            disabled={!canEdit}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      name="subjects"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addSubject" />}
      onAdd={fields => fields.push({ value: '' })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

SubjectFields.propTypes = {
  subjectSources: PropTypes.arrayOf(PropTypes.object).isRequired,
  subjectTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default SubjectFields;
