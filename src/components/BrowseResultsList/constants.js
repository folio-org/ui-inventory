import { FormattedMessage } from 'react-intl';
import { browseModeOptions } from '../../constants';

export const VISIBLE_COLUMNS_MAP = {
  [browseModeOptions.SUBJECTS]: ['subject', 'numberOfTitles'],
  [browseModeOptions.CALL_NUMBERS]: ['callNumber', 'title', 'numberOfTitles'],
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
  contributor: <FormattedMessage id="ui-inventory.instances.columns.contributor" />,
  contributorType: <FormattedMessage id="ui-inventory.instances.columns.contributorType" />,
  relatorTerm: <FormattedMessage id="ui-inventory.instances.columns.relatorTerm" />,
};

export const COLUMNS_WIDTHS = {
  callNumber: '15%',
  subject: '50%',
  contributor: '50%',
  numberOfTitles: '15%',
  select: '30px',
  title: '40%',
  contributorType: '15%',
  relatorTerm: '15%',
};
