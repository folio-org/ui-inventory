import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  RepeatableField,
  TextArea,
  Select,
  Checkbox,
  Row,
  Col,
  Label,
} from '@folio/stripes/components';

import {
  validateFieldLength
} from '../utils';

import {
  NOTE_CHARS_MAX_LENGTH
} from '../constants';

const NoteFields = props => {
  const { formatMessage } = useIntl();

  const {
    noteTypeOptions,
    noteTypeIdField,
    requiredFields,
    renderLegend,
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const noteTypeLabel = formatMessage({ id: 'ui-inventory.noteType' });
  const noteLabel = formatMessage({ id: 'ui-inventory.note' });
  const staffOnlyLabel = formatMessage({ id: 'ui-inventory.staffOnly' });

  const isNoteTypeRequired = requiredFields.some(field => field === noteTypeIdField);
  const isNoteRequired = requiredFields.some(field => field === 'note');
  const isStaffOnlyRequired = requiredFields.some(field => field === 'staffOnly');

  const validate = value => validateFieldLength(value, NOTE_CHARS_MAX_LENGTH);

  const headLabels = (
    <Row>
      <Col sm={5}>
        <Label tagName="legend" required={isNoteTypeRequired}>
          {noteTypeLabel}
        </Label>
      </Col>
      <Col sm={5}>
        <Label tagName="legend" required={isNoteRequired}>
          {noteLabel}
        </Label>
      </Col>
      <Col xs={3} lg={2}>
        <Label tagName="legend" required={isStaffOnlyRequired}>
          {staffOnlyLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={5}>
        <Field
          aria-label={noteTypeLabel}
          name={`${field}.${noteTypeIdField}`}
          component={Select}
          dataOptions={[{ label: formatMessage({ id: 'ui-inventory.selectType' }), value: '' }, ...noteTypeOptions]}
          disabled={!canEdit}
          required={isNoteTypeRequired}
        />
      </Col>
      <Col sm={5}>
        <Field
          aria-label={noteLabel}
          name={`${field}.note`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
          required={isNoteRequired}
          validate={validate}
        />
      </Col>
      <Col xs={3} lg={2}>
        <Field
          aria-label={staffOnlyLabel}
          name={`${field}.staffOnly`}
          component={Checkbox}
          type="checkbox"
          inline
          vertical
          disabled={!canEdit}
          required={isStaffOnlyRequired}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="notes"
      component={RepeatableField}
      legend={renderLegend ? <FormattedMessage id="ui-inventory.notes" /> : null}
      addLabel={<FormattedMessage id="ui-inventory.addNote" />}
      onAdd={fields => fields.push({
        [noteTypeIdField]: '',
        note: '',
        staffOnly: false,
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

NoteFields.propTypes = {
  noteTypeIdField: PropTypes.string.isRequired,
  noteTypeOptions: PropTypes.arrayOf(PropTypes.object),
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  renderLegend: PropTypes.bool,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
NoteFields.defaultProps = {
  noteTypeOptions: [],
  requiredFields: [],
  renderLegend: true,
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default NoteFields;
