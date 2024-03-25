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

import { parseEmptyFormValue } from '../utils';

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

  const urlRelationshipLabel = formatMessage({ id: 'ui-inventory.urlRelationship' });
  const uriLabel = formatMessage({ id: 'ui-inventory.uri' });
  const linkTextLabel = formatMessage({ id: 'ui-inventory.linkText' });
  const materialsSpecificationLabel = formatMessage({ id: 'ui-inventory.materialsSpecification' });
  const urlPublicNoteLabel = formatMessage({ id: 'ui-inventory.urlPublicNote' });

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend">
          {urlRelationshipLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {uriLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {linkTextLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {materialsSpecificationLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {urlPublicNoteLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={2}>
        <Field
          aria-label={urlRelationshipLabel}
          name={`${field}.relationshipId`}
          component={Select}
          parse={parseEmptyFormValue}
          dataOptions={[{ label: formatMessage({ id: 'ui-inventory.selectType' }), value: '' }, ...relationshipOptions]}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={uriLabel}
          name={`${field}.uri`}
          component={TextArea}
          parse={parseEmptyFormValue}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={linkTextLabel}
          name={`${field}.linkText`}
          component={TextArea}
          parse={parseEmptyFormValue}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          aria-label={materialsSpecificationLabel}
          name={`${field}.materialsSpecification`}
          component={TextArea}
          parse={parseEmptyFormValue}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={4}>
        <Field
          aria-label={urlPublicNoteLabel}
          name={`${field}.publicNote`}
          component={TextArea}
          parse={parseEmptyFormValue}
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
  relationship: [],
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ElectronicAccessFields;
