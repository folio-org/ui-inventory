import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Select,
  TextField,
  Checkbox,
} from '@folio/stripes/components';

import RepeatableField from '../../components/RepeatableField';

const Note = ({ noteTypeOptions }) => (
  <FormattedMessage id="ui-inventory.selectType">
    {placeholder => (
      <RepeatableField
        name="notes"
        addButtonId="clickable-add-note"
        addLabel={<FormattedMessage id="ui-inventory.addNote" />}
        template={[
          {
            name: 'holdingsNoteTypeId',
            label: <FormattedMessage id="ui-inventory.noteType" />,
            component: Select,
            placeholder,
            dataOptions: noteTypeOptions,
          },
          {
            name: 'note',
            label: <FormattedMessage id="ui-inventory.note" />,
            component: TextField,
          },
          {
            name: 'staffOnly',
            label: <FormattedMessage id="ui-inventory.staffOnly" />,
            component: Checkbox,
            type: 'checkbox',
            inline: true,
            vertical: true,
            columnSize: {
              xs: 3,
              lg: 2,
            }
          }
        ]}
      />
    )}
  </FormattedMessage>
);

Note.propTypes = {
  noteTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

export default Note;
