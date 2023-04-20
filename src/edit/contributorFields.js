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

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.name" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.nameType" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.type" />
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.typeFreeText" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.primary" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = (field, index, fields) => (
    <Row>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.name' })}
          name={`${field}.name`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.nameType' })}
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
          aria-label={formatMessage({ id: 'ui-inventory.type' })}
          name={`${field}.contributorTypeId`}
          component={Select}
          placeholder={formatMessage({ id: 'ui-inventory.selectType' })}
          dataOptions={contributorTypeOptions}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={4}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.typeFreeText' })}
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
