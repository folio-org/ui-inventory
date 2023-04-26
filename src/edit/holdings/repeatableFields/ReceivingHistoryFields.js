import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Label,
  Checkbox,
  TextArea,
  RepeatableField,
} from '@folio/stripes/components';

const ReceivingHistoryFields = ({
  canAdd,
  canEdit,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const publicDisplayLabel = formatMessage({ id: 'ui-inventory.publicDisplay' });
  const enumerationLabel = formatMessage({ id: 'ui-inventory.enumeration' });
  const chronologyLabel = formatMessage({ id: 'ui-inventory.chronology' });

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend">
          {publicDisplayLabel}
        </Label>
      </Col>
      <Col sm={5}>
        <Label tagName="legend">
          {enumerationLabel}
        </Label>
      </Col>
      <Col sm={5}>
        <Label tagName="legend">
          {chronologyLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={2}>
        <Field
          aria-label={publicDisplayLabel}
          name={`${field}.publicDisplay`}
          component={Checkbox}
          disabled={!canEdit}
          type="checkbox"
        />
      </Col>
      <Col sm={5}>
        <Field
          aria-label={enumerationLabel}
          name={`${field}.enumeration`}
          component={TextArea}
          disabled={!canEdit}
          rows={1}
        />
      </Col>
      <Col sm={5}>
        <Field
          aria-label={chronologyLabel}
          name={`${field}.chronology`}
          component={TextArea}
          disabled={!canEdit}
          rows={1}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="receivingHistory.entries"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addReceivingHistory" />}
      onAdd={fields => fields.push({
        publicDisplay: false,
        enumeration: '',
        chronology: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

ReceivingHistoryFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

ReceivingHistoryFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ReceivingHistoryFields;
