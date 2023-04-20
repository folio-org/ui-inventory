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

const ElectronicAccessFields = props => {
  const { formatMessage } = useIntl();

  const {
    relationship,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const relationshipOptions = relationship.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.urlRelationship" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.uri" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.linkText" />
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.materialsSpecification" />
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.urlPublicNote" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.urlRelationship' })}
          name={`${field}.relationshipId`}
          component={Select}
          dataOptions={[{ label: formatMessage({ id: 'ui-inventory.selectType' }), value: '' }, ...relationshipOptions]}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.uri' })}
          name={`${field}.uri`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.linkText' })}
          name={`${field}.linkText`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.materialsSpecification' })}
          name={`${field}.materialsSpecification`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={4}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.urlPublicNote' })}
          name={`${field}.publicNote`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="electronicAccess"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.electronicAccess" />}
      addLabel={<FormattedMessage id="ui-inventory.addElectronicAccess" />}
      onAdd={fields => fields.push({
        relationshipId: '',
        uri: '',
        linkText: '',
        materialsSpecification: '',
        publicNote: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

ElectronicAccessFields.propTypes = {
  relationship: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

ElectronicAccessFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ElectronicAccessFields;
