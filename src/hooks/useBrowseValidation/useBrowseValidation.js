import { FormattedMessage } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

import { browseModeOptions } from '../../constants';

const useBrowseValidation = (browseMode) => {
  const showCallout = useShowCallout();

  const validateDataQuery = (query) => {
    const containsAsterisk = /\*/;
    const isValidSearch = !containsAsterisk.test(query);
    const isContributors = browseMode === browseModeOptions.CONTRIBUTORS;

    if (isContributors && !isValidSearch) {
      showCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.browseContributors.results.error" />,
      });

      return false;
    }

    return true;
  };

  return {
    validateDataQuery,
  };
};

export default useBrowseValidation;
