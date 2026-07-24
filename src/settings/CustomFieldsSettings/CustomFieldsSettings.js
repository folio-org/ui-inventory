import { useIntl } from 'react-intl';
import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  ViewCustomFieldsSettings,
} from '@folio/stripes/smart-components';

import {
  CUSTOM_FIELDS_INVENTORY_BACKEND_NAME,
  ENTITY_TYPE_ITEM_INVENTORY,
  ITEM_CONFIG_NAME_PREFIX,
  SCOPE_CUSTOM_FIELDS_MANAGE,
} from '../../constants';

const CustomFieldsSettings = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const baseItem = '/settings/inventory/itemCustomFields';

  const permissions = {
    canView: stripes.hasPerm('ui-inventory.settings.custom-fields.view'),
    canEdit: stripes.hasPerm('ui-inventory.settings.custom-fields.edit'),
    canDelete: stripes.hasPerm('ui-inventory.settings.custom-fields.delete'),
  };

  return (
    <Switch>
      <Route exact path={baseItem}>
        <TitleManager record={intl.formatMessage({ id: 'ui-inventory.settings.customFields.el' })}>
          <ViewCustomFieldsSettings
            backendModuleName={CUSTOM_FIELDS_INVENTORY_BACKEND_NAME}
            entityType={ENTITY_TYPE_ITEM_INVENTORY}
            editRoute={`${baseItem}/edit`}
            permissions={permissions}
            scope={SCOPE_CUSTOM_FIELDS_MANAGE}
            configNamePrefix={ITEM_CONFIG_NAME_PREFIX}
          />
        </TitleManager>
      </Route>
    </Switch>
  );
};

export default CustomFieldsSettings;
