import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { change } from 'redux-form';
import {
  Icon,
  TextField,
  Select,
  Button,
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
              component: ({ label, meta, input, fields }) => { /* eslint-disable-line react/prop-types */
                const isPrimary = input.value === true;
                const handleChange = () => {
                  // Reset other primary fields
                  fields.forEach(fieldName => meta.dispatch(change(meta.form, `${fieldName}.primary`, false)));

                  // Set primary flag for current field
                  input.onChange(true);
                };

                return (
                  <Fragment>
                    { label && <Label>{label}</Label>}
                    <Button
                      buttonStyle={isPrimary ? 'primary' : 'default'}
                      onClick={!isPrimary ? handleChange : null}
                      type="button"
                      fullWidth
                    >
                      <FormattedMessage id={`ui-inventory.${isPrimary ? 'primary' : 'makePrimary'}`} />
                    </Button>
                  </Fragment>
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
