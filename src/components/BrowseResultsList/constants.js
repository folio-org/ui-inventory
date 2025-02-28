import { FormattedMessage } from 'react-intl';

import { browseModeOptions } from '@folio/stripes-inventory-components';

export const VISIBLE_COLUMNS_MAP = {
  [browseModeOptions.SUBJECTS]: ['subject', 'subjectSource', 'subjectType', 'numberOfTitles'],
  [browseModeOptions.CALL_NUMBERS]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.DEWEY]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.LIBRARY_OF_CONGRESS]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.LOCAL]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.OTHER]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.CLASSIFICATION_ALL]: ['classificationNumber', 'numberOfTitles'],
  [browseModeOptions.DEWEY_CLASSIFICATION]: ['classificationNumber', 'numberOfTitles'],
  [browseModeOptions.LC_CLASSIFICATION]: ['classificationNumber', 'numberOfTitles'],
  [browseModeOptions.SUPERINTENDENT]: ['callNumber', 'title', 'numberOfTitles'],
  [browseModeOptions.CONTRIBUTORS]: ['contributor', 'contributorType', 'relatorTerm', 'numberOfTitles'],
};

export const COLUMNS_MAPPING = {
  callNumber: <FormattedMessage id="ui-inventory.instances.columns.callNumber" />,
  title: <FormattedMessage id="ui-inventory.instances.columns.title" />,
  contributors: <FormattedMessage id="ui-inventory.instances.columns.contributors" />,
  publishers: <FormattedMessage id="ui-inventory.instances.columns.publishers" />,
  relation: <FormattedMessage id="ui-inventory.instances.columns.relation" />,
  numberOfTitles: <FormattedMessage id="ui-inventory.instances.columns.numberOfTitles" />,
  subject: <FormattedMessage id="ui-inventory.subject" />,
  subjectSource: <FormattedMessage id="ui-inventory.subjectSource" />,
  subjectType: <FormattedMessage id="ui-inventory.subjectType" />,
  contributor: <FormattedMessage id="ui-inventory.instances.columns.contributor" />,
  contributorType: <FormattedMessage id="ui-inventory.instances.columns.contributorType" />,
  relatorTerm: <FormattedMessage id="ui-inventory.instances.columns.relatorTerm" />,
  classificationNumber: <FormattedMessage id="ui-inventory.instances.columns.classificationNumber" />,
};

export const COLUMNS_WIDTHS = {
  [browseModeOptions.CALL_NUMBERS]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.DEWEY]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.LIBRARY_OF_CONGRESS]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.LOCAL]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.OTHER]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.SUPERINTENDENT]: {
    callNumber: '15%',
    title: '70%',
    numberOfTitles: '15%',
  },
  [browseModeOptions.CLASSIFICATION_ALL]: {
    classificationNumber: '50%',
  },
  [browseModeOptions.DEWEY_CLASSIFICATION]: {
    classificationNumber: '50%',
  },
  [browseModeOptions.LC_CLASSIFICATION]: {
    classificationNumber: '50%',
  },
  [browseModeOptions.CONTRIBUTORS]: {
    contributor: '50%',
    contributorType: '15%',
    relatorTerm: '15%',
  },
  [browseModeOptions.SUBJECTS]: {
    subject: '40%',
    subjectSource: '20%',
    subjectType: '20%',
  },
};
