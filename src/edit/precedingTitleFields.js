import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PrecedingTitles = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="precedingTitles"
      label={<FormattedMessage id="ui-inventory.precedingTitles" />}
      addLabel={<FormattedMessage id="ui-inventory.addPrecedingTitle" />}
      addButtonId="clickable-add-precedingTitle"
      template={[
        {
          name: 'superInstanceId',
          label: 'FOLIO ID',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
      ]}
      newItemTemplate={{ superInstanceId: '' }}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

PrecedingTitles.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
PrecedingTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PrecedingTitles;
