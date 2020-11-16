import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TextArea,
  Select
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ElectronicAccessFields = props => {
  const {
    relationship,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const relationshipOptions = relationship.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <FormattedMessage id="ui-inventory.selectType">
      {placeholder => (
        <RepeatableField
          name="electronicAccess"
          label={<FormattedMessage id="ui-inventory.electronicAccess" />}
          addLabel={<FormattedMessage id="ui-inventory.addElectronicAccess" />}
          addButtonId="clickable-add-electronicaccess"
          template={[
            {
              name: 'relationshipId',
              label: <FormattedMessage id="ui-inventory.urlRelationship" />,
              component: Select,
              placeholder,
              dataOptions: relationshipOptions,
              disabled: !canEdit,
            },
            {
              name: 'uri',
              label: <FormattedMessage id="ui-inventory.uri" />,
              component: TextArea,
              rows: 1,
              disabled: !canEdit,
            },
            {
              name: 'linkText',
              label: <FormattedMessage id="ui-inventory.linkText" />,
              component: TextArea,
              rows: 1,
              disabled: !canEdit,
            },
            {
              name: 'materialsSpecification',
              label: <FormattedMessage id="ui-inventory.materialsSpecification" />,
              component: TextArea,
              rows: 1,
              disabled: !canEdit,
            },
            {
              name: 'publicNote',
              label: <FormattedMessage id="ui-inventory.urlPublicNote" />,
              component: TextArea,
              rows: 1,
              disabled: !canEdit,
            },
          ]}
          canAdd={canAdd}
          canDelete={canDelete}
        />
      )}
    </FormattedMessage>
  );
};

ElectronicAccessFields.propTypes = {
  relationship: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

ElectronicAccessFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default ElectronicAccessFields;
