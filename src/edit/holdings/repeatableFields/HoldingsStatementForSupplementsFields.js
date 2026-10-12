import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import PropTypes from 'prop-types';

import {
  Col,
  Label,
  Row,
  TextArea,
  RepeatableField,
} from '@folio/stripes/components';

const HoldingsStatementForSupplementsFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const statementLabel = formatMessage({ id: 'ui-inventory.holdingsStatementForSupplements' });
  const noteLabel = formatMessage({ id: 'ui-inventory.holdingsStatementForSupplementsPublicNote' });
  const staffOnlyLabel = formatMessage({ id: 'ui-inventory.holdingsStatementForSupplementsStaffNote' });

  const headLabels = (
    <Row>
      <Col sm={4}>
        <Label tagName="legend">
          {statementLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {noteLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {staffOnlyLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => {
    return (
      <Row>
        <Col sm={4}>
          <Field
            aria-label={statementLabel}
            name={`${field}.statement`}
            component={TextArea}
            disabled={!canEdit}
            rows={1}
          />
        </Col>
        <Col sm={4}>
          <Field
            aria-label={noteLabel}
            name={`${field}.note`}
            component={TextArea}
            disabled={!canEdit}
            rows={1}
          />
        </Col>
        <Col sm={4}>
          <Field
            aria-label={staffOnlyLabel}
            name={`${field}.staffNote`}
            component={TextArea}
            disabled={!canEdit}
            rows={1}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      name="holdingsStatementsForSupplements"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addHoldingsStatementForSupplements" />}
      onAdd={fields => fields.push({
        statement: '',
        note: '',
        staffNote: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

HoldingsStatementForSupplementsFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default HoldingsStatementForSupplementsFields;
