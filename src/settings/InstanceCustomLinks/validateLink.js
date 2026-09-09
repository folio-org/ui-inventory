import { FormattedMessage } from 'react-intl';

const patterns = /\{\{(UUID|HRID|indexTitle)\}\}/;

export default function validateBaseUrl(item) {
  const errors = {};

  if (!item.link) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLink.error.linkRequired" />;
  }

  if (item.link && !item.link.toLowerCase().startsWith('https://') && !item.link.toLowerCase().startsWith('http://')) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLink.error.linkProtocol" />;
  }

  if (item.link && !patterns.test(item.link) && item.link.indexOf("{{") >= 0 && item.link.indexOf("}}") >= 0) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLink.error.linkParameter" />;
  }
  
  return errors;
};