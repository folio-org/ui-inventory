import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SucceedingTitles = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="succeedingTitles"
      label=""
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addSucceedingTitle" />
        </Icon>
      }
      addButtonId="clickable-add-succeedingTitle"
      template={[
        {
          name: 'subInstanceId',
          label: 'FOLIO ID',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
      ]}
      newItemTemplate={{ subInstanceId: '' }}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

SucceedingTitles.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
SucceedingTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default SucceedingTitles;
