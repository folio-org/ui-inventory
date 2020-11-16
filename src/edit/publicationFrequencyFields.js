import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { TextArea } from '@folio/stripes/components';

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
      addLabel={<FormattedMessage id="ui-inventory.addPublicationFrequency" />}
      addButtonId="clickable-add-publicationfrequency"
      template={[{
        label: <FormattedMessage id="ui-inventory.publicationFrequency" />,
        component: TextArea,
        rows: 1,
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
