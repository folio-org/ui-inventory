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

const CirculationNotesFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const noteTypeOptions = [
    { label: formatMessage({ id: 'ui-inventory.selectType' }), value: '' },
    { label: 'Check in note', value: 'Check in' },
    { label: 'Check out note', value: 'Check out' }
  ];

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
          name={`${field}.noteType`}
          component={Select}
          dataOptions={noteTypeOptions}
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
      name="circulationNotes"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addCirculationNote" />}
      onAdd={fields => fields.push({
        noteType: '',
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

CirculationNotesFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default CirculationNotesFields;
