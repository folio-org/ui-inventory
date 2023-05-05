import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Label,
  TextArea,
  RepeatableField,
} from '@folio/stripes/components';

const HoldingsStatementFields = ({
  canAdd,
  canEdit,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const statementLabel = formatMessage({ id: 'ui-inventory.holdingsStatement' });
  const noteLabel = formatMessage({ id: 'ui-inventory.holdingsStatementPublicNote' });
  const staffOnlyLabel = formatMessage({ id: 'ui-inventory.holdingsStatementStaffNote' });

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

  const renderField = field => (
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

  return (
    <FieldArray
      name="holdingsStatements"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.holdingsStatements" />}
      addLabel={<FormattedMessage id="ui-inventory.addHoldingsStatement" />}
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

HoldingsStatementFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

HoldingsStatementFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default HoldingsStatementFields;
