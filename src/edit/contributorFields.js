import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { change } from 'redux-form';
import {
  Icon,
  TextField,
  Select,
  RadioButton,
  Label,
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
            {
              name: 'primary',
              label: intl.formatMessage({ id: 'ui-inventory.primary' }),
              component: ({ label, meta, input, fields, ...rest }) => {
                const handleChange = (currentInput) => () => {
                  // Find the index of the current primary contributor
                  const currentPrimaryIndex = fields.getAll().findIndex(field => field.primary);

                  // Remove primary flag from current primary contributor
                  if (currentPrimaryIndex > 0) {
                    meta.dispatch(change(meta.form, `contributors[${currentPrimaryIndex}].primary`, false, true, false));
                  }

                  // Set primary flag for current field
                  currentInput.onChange(true);
                };

                return (
                  <div>
                    { label && <Label>{label}</Label>}
                    <RadioButton
                      meta={meta}
                      {...rest}
                      name="primary"
                      onChange={handleChange(input)}
                      checked={input.value === true}
                      aria-label={intl.formatMessage({ id: 'ui-inventory.primary' })}
                      inline
                    />
                  </div>
                );
              }
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
