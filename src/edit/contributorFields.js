import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  TextField,
  TextArea,
  Select,
} from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';
import RepeatableField from '../components/RepeatableField';
import PrimaryToggleButton from './components/PrimaryToggleButton';

const ContributorFields = props => {
  const {
    contributorNameTypes,
    contributorTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const contributorNameTypeOptions = contributorNameTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const contributorTypeOptions = contributorTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="contributors"
          label={<FormattedMessage id="ui-inventory.contributors" />}
          addLabel={<FormattedMessage id="ui-inventory.addContributor" />}
          addButtonId="clickable-add-contributor"
          template={[
            {
              label: <FormattedMessage id="ui-inventory.name" />,
              name: 'name',
              component: TextArea,
              rows: 1,
              required: true,
              disabled: !canEdit,
            }, {
              label: <FormattedMessage id="ui-inventory.nameType" />,
              name: 'contributorNameTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectType' }),
              dataOptions: contributorNameTypeOptions,
              required: true,
              disabled: !canEdit,
            }, {
              label: <FormattedMessage id="ui-inventory.type" />,
              name: 'contributorTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectType' }),
              dataOptions: contributorTypeOptions,
              disabled: !canEdit,
            }, {
              label: <FormattedMessage id="ui-inventory.typeFreeText" />,
              name: 'contributorTypeText',
              rows: 1,
              component: TextArea,
              disabled: !canEdit,
            }, {
              name: 'primary',
              label: intl.formatMessage({ id: 'ui-inventory.primary' }),
              component: PrimaryToggleButton,
              disabled: !canEdit,
            },
          ]}
          newItemTemplate={{
            name: '',
            contributorNameTypeId: '',
            primary: false,
            contributorTypeText: '',
          }}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </IntlConsumer>
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
ContributorFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ContributorFields;
