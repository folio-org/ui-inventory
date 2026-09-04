import { FormattedMessage } from 'react-intl';

export default function validateBaseUrl(item) {
  const errors = {};

  if (!item.baseUrl) {
    errors.baseUrl = <FormattedMessage id="ui-inventory.instanceCustomLink.error.baseUrlRequired" />;
  }

  if (item.baseUrl && !item.baseUrl.startsWith('https://') && !item.baseUrl.startsWith('http://')) {
    errors.baseUrl = <FormattedMessage id="ui-inventory.instanceCustomLink.error.baseUrlProtocol" />;
  }

  return errors;
};