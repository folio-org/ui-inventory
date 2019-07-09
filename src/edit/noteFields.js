import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const NoteFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="notes"
      label={<FormattedMessage id="ui-inventory.notes" />}
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addNote" />
        </Icon>
      }
      addButtonId="clickable-add-notes"
      template={[{
        label: <FormattedMessage id="ui-inventory.note" />,
        component: TextField,
        disabled: !canEdit,
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

NoteFields.propTypes = {
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
