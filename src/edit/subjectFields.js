import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { TextField } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const SubjectFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  return (
    <RepeatableField
      name="subjects"
      addLabel={<FormattedMessage id="ui-inventory.addSubject" />}
      addButtonId="clickable-add-subject"
      template={[{
        component: TextField,
        label: <FormattedMessage id="ui-inventory.subjects" />,
        disabled: !canEdit,
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
    />
  );
};

SubjectFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
SubjectFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default SubjectFields;
