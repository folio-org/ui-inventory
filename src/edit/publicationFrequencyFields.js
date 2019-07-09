import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const PublicationFrequencyFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="publicationFrequency"
      label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addPublicationFrequency" />
        </Icon>
      }
      addButtonId="clickable-add-publicationfrequency"
      template={[{
        label: <FormattedMessage id="ui-inventory.publicationFrequency" />,
        component: TextField,
        disabled: !canEdit,
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

PublicationFrequencyFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
PublicationFrequencyFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PublicationFrequencyFields;
