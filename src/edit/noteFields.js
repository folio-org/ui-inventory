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

const NoteFields = props => {
  const { formatMessage } = useIntl();

  const {
    instanceNoteTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const instanceNoteTypeOptions = instanceNoteTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const headLabels = (
    <Row>
      <Col sm={5}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.noteType" />
        </Label>
      </Col>
      <Col sm={5}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.note" />
        </Label>
      </Col>
      <Col xs={3} lg={2}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.staffOnly" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={5}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.noteType' })}
          name={`${field}.instanceNoteTypeId`}
          component={Select}
          dataOptions={[{ label: formatMessage({ id: 'ui-inventory.selectType' }), value: '' }, ...instanceNoteTypeOptions]}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={5}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.note' })}
          name={`${field}.note`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col xs={3} lg={2}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.staffOnly' })}
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
        instanceNoteTypeId: '',
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
  instanceNoteTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
NoteFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default NoteFields;
