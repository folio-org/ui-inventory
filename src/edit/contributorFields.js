import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  intlShape,
  injectIntl,
} from 'react-intl';

import {
  TextField,
  Select,
  Checkbox,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ContributorFields = ({
  contributorNameTypes,
  contributorTypes,
  intl: { formatMessage },
}) => {
  const contributorNameTypeOptions = contributorNameTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  const contributorTypeOptions = contributorTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="contributors"
      label={<FormattedMessage id="ui-inventory.contributors" />}
      addLabel={<FormattedMessage id="ui-inventory.addContributor" />}
      addButtonId="clickable-add-contributor"
      template={[
        {
          label: <FormattedMessage id="ui-inventory.name" />,
          name: 'name',
          component: TextField,
        },
        {
          label: (
            <FormattedMessage id="ui-inventory.nameType">
              {(message) => message + ' *'}
            </FormattedMessage>
          ),
          name: 'contributorNameTypeId',
          component: Select,
          placeholder: formatMessage({ id: 'ui-inventory.selectType' }),
          dataOptions: contributorNameTypeOptions,
          required: true,
        },
        {
          label: <FormattedMessage id="ui-inventory.primary" />,
          name: 'primary',
          component: Checkbox,
        },
        {
          label: <FormattedMessage id="ui-inventory.type" />,
          name: 'contributorTypeId',
          component: Select,
          placeholder: formatMessage({ id: 'ui-inventory.selectType' }),
          dataOptions: contributorTypeOptions,
        },
        {
          label: <FormattedMessage id="ui-inventory.typeFreeText" />,
          name: 'contributorTypeText',
          component: TextField,
        },
      ]}
      newItemTemplate={{
        name: '',
        contributorNameTypeId: '',
        primary: '',
        contributorTypeId: '',
        contributorTypeText: '',
      }}
    />
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  intl: intlShape.isRequired,
};

export default injectIntl(ContributorFields);
