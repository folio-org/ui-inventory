import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';

import translations from '../../../translations/ui-inventory/en';

const translationsProperties = [
  {
    prefix: 'ui-inventory',
    translations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      hideSearchPane: 'hideSearchPane',
      showSearchPane: 'showSearchPane',
      numberOfFilters: 'numberOfFilters',
    },
  },
];

export default translationsProperties;
