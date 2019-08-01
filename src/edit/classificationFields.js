import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ClassificationFields = props => {
  const {
    classificationTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const classificationTypeOptions = classificationTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="classifications"
          label={<FormattedMessage id="ui-inventory.classification" />}
          addLabel={
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-inventory.addClassification" />
            </Icon>
          }
          addButtonId="clickable-add-classification"
          addDefaultItem={false}
          template={[
            {
              label: intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
              name: 'classificationTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectClassification' }),
              dataOptions: classificationTypeOptions,
              required: true,
              disabled: !canEdit,
            },
            {
              label: intl.formatMessage({ id: 'ui-inventory.classification' }),
              name: 'classificationNumber',
              component: TextField,
              required: true,
              disabled: !canEdit,
            },
          ]}
          newItemTemplate={{ classificationNumber: '', classificationTypeId: '' }}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </IntlConsumer>
  );
};

ClassificationFields.propTypes = {
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
ClassificationFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ClassificationFields;
