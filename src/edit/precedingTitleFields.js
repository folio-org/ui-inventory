import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';

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
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.addPrecedingTitle" />
        </Icon>
      }
      addButtonId="clickable-add-precedingTitle"
      template={[
        {
          name: 'precedingTitle',
          label: 'Preceding title',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
        {
          name: 'precedingTitleInstanceHRID',
          label: 'Instance HRID',
          component: TextField,
          required: true,
          disabled: !canEdit
        },
        {
          name: 'precedingTitleISSN',
          label: 'ISSN',
          component: TextField,
          disabled: !canEdit
        },
        {
          name: 'precedingTitleISBN',
          label: 'ISBN',
          component: TextField,
          disabled: !canEdit
        }
      ]}
      newItemTemplate={{ precedingTitle: '', precedingTitleInstanceHRID: '', precedingTitleISSN: '', precedingTitleISBN: '' }}
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
