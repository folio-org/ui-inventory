import { FormattedMessage } from 'react-intl';

const patterns = /\{\{(UUID|HRID|indexTitle)\}\}/;

export default function validateQueryString(item) {
  const errors = {};

  if (item.queryString && !patterns.test(item.queryString)) {
    errors.queryString = <FormattedMessage id="ui-inventory.instanceCustomLink.error.queryStringParameter" />;
  }

  if (item.queryString && item.queryString.length > 150) {
    errors.queryString = <FormattedMessage id="ui-inventory.instanceCustomLink.error.queryStringTooLong" />;
  }

  return errors;
};
