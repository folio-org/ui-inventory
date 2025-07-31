import { useSettings } from '@folio/stripes/core';
import {
  DISPLAY_SETTINGS_KEY,
  DISPLAY_SETTINGS_SCOPE,
} from '@folio/stripes-inventory-components';

const withDisplaySettings = (WrappedComponent) => {
  const WithDisplaySettings = (props) => {
    const { settings: displaySettings } = useSettings({
      scope: DISPLAY_SETTINGS_SCOPE,
      key: DISPLAY_SETTINGS_KEY,
    });

    return <WrappedComponent displaySettings={displaySettings} {...props} />;
  };

  WithDisplaySettings.manifest = WrappedComponent.manifest;

  return WithDisplaySettings;
};

export { withDisplaySettings };
