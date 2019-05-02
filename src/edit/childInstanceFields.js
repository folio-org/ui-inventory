import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ChildInstanceFields = ({ instanceRelationshipTypes }) => {
  const relationshipOptions = instanceRelationshipTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <IntlConsumer>
      {intl => (
        <RepeatableField
          name="childInstances"
          label={<FormattedMessage id="ui-inventory.childInstances" />}
          addLabel={<FormattedMessage id="ui-inventory.addChildInstance" />}
          addButtonId="clickable-add-childinstance"
          template={[
            {
              label: intl.formatMessage({ id: 'ui-inventory.childInstance' }),
              name: 'subInstanceId',
              component: TextField,
              required: true,
            },
            {
              label: intl.formatMessage({ id: 'ui-inventory.typeOfRelation' }),
              name: 'instanceRelationshipTypeId',
              component: Select,
              placeholder: intl.formatMessage({ id: 'ui-inventory.selectType' }),
              dataOptions: relationshipOptions,
              required: true,
            },
          ]}
          newItemTemplate={{ subInstanceId: '', relationshipTypeId: '' }}
        />
      )}
    </IntlConsumer>
  );
};

ChildInstanceFields.propTypes = {
  instanceRelationshipTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ChildInstanceFields;
