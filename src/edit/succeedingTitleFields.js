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
          name: 'succeedingTitle',
          label: 'Succeeding title',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
        {
          name: 'succeedingTitleInstanceHRID',
          label: 'Instance HRID',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
        {
          name: 'succeedingTitleISSN',
          label: 'ISSN',
          component: TextField,
          disabled: !canEdit
        },
        {
          name: 'succeedingTitleISBN',
          label: 'ISBN',
          component: TextField,
          disabled: !canEdit
        }
      ]}
      newItemTemplate={{ succeedingTitle: '', succeedingTitleInstanceHRID: '', succeedingTitleISSN: '', succeedingTitleISBN: '' }}
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
