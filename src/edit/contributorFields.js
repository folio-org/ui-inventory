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
  TextArea,
  Select,
  Row,
  Col,
  Label,
} from '@folio/stripes/components';

import PrimaryToggleButton from './components/PrimaryToggleButton';

const ContributorFields = props => {
  const { formatMessage } = useIntl();

  const {
    contributorNameTypes,
    contributorTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const contributorNameTypeOptions = contributorNameTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const contributorTypeOptions = contributorTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const nameLabel = formatMessage({ id: 'ui-inventory.name' });
  const nameTypeLabel = formatMessage({ id: 'ui-inventory.nameType' });
  const typeLabel = formatMessage({ id: 'ui-inventory.type' });
  const typeFreeTextLabel = formatMessage({ id: 'ui-inventory.typeFreeText' });
  const primaryLabel = formatMessage({ id: 'ui-inventory.primary' });

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend" required>
          {nameLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend" required>
          {nameTypeLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {typeLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {typeFreeTextLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {primaryLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = (field, index, fields) => (
    <Row>
      <Col sm={2}>
        <Field
          aria-label={nameLabel}
          name={`${field}.name`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={nameTypeLabel}
          name={`${field}.contributorNameTypeId`}
          component={Select}
          placeholder={formatMessage({ id: 'ui-inventory.selectType' })}
          dataOptions={contributorNameTypeOptions}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={typeLabel}
          name={`${field}.contributorTypeId`}
          component={Select}
          placeholder={formatMessage({ id: 'ui-inventory.selectType' })}
          dataOptions={contributorTypeOptions}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={4}>
        <Field
          aria-label={typeFreeTextLabel}
          name={`${field}.contributorTypeText`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          name={`${field}.primary`}
          component={PrimaryToggleButton}
          disabled={!canEdit}
          fields={fields}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="contributors"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.contributors" />}
      addLabel={<FormattedMessage id="ui-inventory.addContributor" />}
      onAdd={fields => fields.push({
        name: '',
        contributorNameTypeId: '',
        contributorTypeText: '',
        primary: false,
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
ContributorFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ContributorFields;
