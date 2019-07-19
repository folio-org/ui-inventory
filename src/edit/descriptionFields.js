import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const DescriptionFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="physicalDescriptions"
      label={<FormattedMessage id="ui-inventory.physicalDescriptions" />}
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addDescription" />
        </Icon>
      }
      addButtonId="clickable-add-description"
      template={[{
        label: <FormattedMessage id="ui-inventory.physicalDescription" />,
        component: TextField,
        disabled: !canEdit,
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

DescriptionFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
DescriptionFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default DescriptionFields;
