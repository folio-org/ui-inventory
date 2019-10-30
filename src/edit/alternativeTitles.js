import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const AlternativeTitles = props => {
  const {
    alternativeTitleTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const alternativeTitleTypeOptions = alternativeTitleTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <FormattedMessage id="ui-inventory.selectAlternativeTitleType">
      {placeholder => (
        <RepeatableField
          name="alternativeTitles"
          label={<FormattedMessage id="ui-inventory.alternativeTitles" />}
          addLabel={<FormattedMessage id="ui-inventory.addAlternativeTitles" />}
          addButtonId="clickable-add-alternativeTitle"
          template={[
            {
              name: 'alternativeTitleTypeId',
              label: <FormattedMessage id="ui-inventory.type" />,
              component: Select,
              placeholder,
              dataOptions: alternativeTitleTypeOptions,
              required: true,
              disabled: !canEdit
            },
            {
              name: 'alternativeTitle',
              label: <FormattedMessage id="ui-inventory.alternativeTitle" />,
              component: TextField,
              required: true,
              disabled: !canEdit
            }
          ]}
          newItemTemplate={{ alternativeTitleTypeId: '', alternativeTitle: '' }}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </FormattedMessage>
  );
};

AlternativeTitles.propTypes = {
  alternativeTitleTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
AlternativeTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default AlternativeTitles;
