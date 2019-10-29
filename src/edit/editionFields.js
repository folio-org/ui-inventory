import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const EditionFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="editions"
      label={<FormattedMessage id="ui-inventory.editions" />}
      addLabel={<FormattedMessage id="ui-inventory.addEdition" />}
      addButtonId="clickable-add-edition"
      template={[{
        component: TextField,
        label: <FormattedMessage id="ui-inventory.edition" />,
        disabled: !canEdit,
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

EditionFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
EditionFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default EditionFields;
