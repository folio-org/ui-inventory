import { browseModeOptions } from '@folio/stripes-inventory-components';

export const browseInstanceIndexes = [
  {
    label: 'ui-inventory.browse.callNumbers',
    queryTemplate: '%{query.query}',
    subIndexes: [
      { label: 'ui-inventory.browse.callNumbersAll', value: browseModeOptions.CALL_NUMBERS },
      { label: 'ui-inventory.browse.dewey', value: browseModeOptions.DEWEY },
      { label: 'ui-inventory.browse.libOfCongress', value: browseModeOptions.LIBRARY_OF_CONGRESS },
      { label: 'ui-inventory.browse.natLibOfMed', value: browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE },
      { label: 'ui-inventory.browse.other', value: browseModeOptions.OTHER },
      { label: 'ui-inventory.browse.superintendent', value: browseModeOptions.SUPERINTENDENT },
    ],
  },
  {
    label: 'ui-inventory.browse.classification',
    queryTemplate: '%{query.query}',
    subIndexes: [
      { label: 'ui-inventory.browse.classification.all', value: browseModeOptions.CLASSIFICATION_ALL },
      { label: 'ui-inventory.browse.classification.dewey', value: browseModeOptions.DEWEY_CLASSIFICATION },
      { label: 'ui-inventory.browse.classification.lc', value: browseModeOptions.LC_CLASSIFICATION },
    ],
  },
  { label: 'ui-inventory.browse.contributors', value: `${browseModeOptions.CONTRIBUTORS}`, queryTemplate: '%{query.query}' },
  { label: 'ui-inventory.browse.subjects', value: `${browseModeOptions.SUBJECTS}`, queryTemplate: '%{query.query}' },
];
