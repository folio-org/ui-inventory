import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  TextArea,
  Select,
  Checkbox,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const NoteFields = props => {
  const {
    instanceNoteTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const translate = useIntl();
  const instanceNoteTypeOptions = instanceNoteTypes.map(it => ({
    label: translate.formatMessage({ id: `ui-inventory.instanceNoteTypes.name.${it.name}`, defaultMessage: it.name }),
    value: it.id,
  }));

  return (
    <RepeatableField
      name="notes"
      label={<FormattedMessage id="ui-inventory.notes" />}
      addLabel={<FormattedMessage id="ui-inventory.addNote" />}
      addButtonId="clickable-add-notes"
      template={[
        {
          name: 'instanceNoteTypeId',
          label: <FormattedMessage id="ui-inventory.noteType" />,
          component: Select,
          disabled: !canEdit,
          dataOptions: [{ label: translate.formatMessage({ id: 'ui-inventory.selectType', defaultMessage: 'Select type' }), value: '' }, ...instanceNoteTypeOptions],
        },
        {
          name: 'note',
          label: <FormattedMessage id="ui-inventory.note" />,
          disabled: !canEdit,
          component: TextArea,
          rows: 1,
        },
        {
          name: 'staffOnly',
          label: <FormattedMessage id="ui-inventory.staffOnly" />,
          component: Checkbox,
          disabled: !canEdit,
          type: 'checkbox',
          inline: true,
          vertical: true,
          columnSize: {
            xs: 3,
            lg: 2,
          }
        }
      ]}
      canAdd={canAdd}
      canDelete={canDelete}
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
