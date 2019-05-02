import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
  Select,
  Checkbox,
} from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import RepeatableField from '../components/RepeatableField';

const ContributorFields = ({
  contributorNameTypes,
  contributorTypes,
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
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="contributors"
          label={<FormattedMessage id="ui-inventory.contributors" />}
          addLabel={
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-inventory.addContributors" />
            </Icon>
          }
          addButtonId="clickable-add-contributor"
          template={[
            {
              label: <FormattedMessage id="ui-inventory.name" />,
              name: 'name',
              component: TextField,
            },
            {
              label: <FormattedMessage id="ui-inventory.nameType" />,
              name: 'contributorNameTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectType' }),
              dataOptions: contributorNameTypeOptions,
              required: true,
            },
            {
              label: <FormattedMessage id="ui-inventory.primary" />,
              name: 'primary',
              component: Checkbox,
              type: 'checkbox',
            },
            {
              label: <FormattedMessage id="ui-inventory.type" />,
              name: 'contributorTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectType' }),
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
            primary: false,
            contributorTypeId: '',
            contributorTypeText: '',
          }}
        />
      )}
    </IntlConsumer>
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
