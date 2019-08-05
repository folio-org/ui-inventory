import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
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
        addLabel={
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-inventory.addNote" />
          </Icon>
        }
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
