import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Col,
  Label,
  RepeatableField,
  Row,
  Select,
  TextArea,
} from '@folio/stripes/components';

const NoteFields = ({
  noteTypeOptions,
  canAdd,
  canEdit,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const noteTypeLabel = formatMessage({ id: 'ui-inventory.noteType' });
  const noteLabel = formatMessage({ id: 'ui-inventory.note' });
  const staffOnlyLabel = formatMessage({ id: 'ui-inventory.staffOnly' });

  const headLabels = (
    <Row>
      <Col sm={5}>
        <Label tagName="legend" required>
          {noteTypeLabel}
        </Label>
      </Col>
      <Col sm={5}>
        <Label tagName="legend" required>
          {noteLabel}
        </Label>
      </Col>
      <Col xs={3} lg={2}>
        <Label tagName="legend">
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
          name={`${field}.holdingsNoteTypeId`}
          component={Select}
          dataOptions={[
            {
              label: formatMessage({ id: 'ui-inventory.selectType' }),
              value: '',
            },
            ...noteTypeOptions,
          ]}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={5}>
        <Field
          aria-label={noteLabel}
          name={`${field}.note`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
          required
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
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="notes"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.notes" />}
      addLabel={<FormattedMessage id="ui-inventory.addNote" />}
      onAdd={fields => fields.push({
        holdingsNoteTypeId: '',
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
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  noteTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

NoteFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default NoteFields;
