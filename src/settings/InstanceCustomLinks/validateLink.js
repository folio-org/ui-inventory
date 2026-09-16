import { FormattedMessage } from 'react-intl';

const patterns = /\{\{(UUID|HRID|indexTitle)\}\}/;

export default function validateLink(item) {
  const errors = {};

  if (!item.link) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkRequired" />;
  }

  if (item.link && !item.link.toLowerCase().startsWith('https://') && !item.link.toLowerCase().startsWith('http://')) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkProtocol" />;
  }

  if (item.link && !patterns.test(item.link) && item.link.includes('{{') && item.link.includes('}}')) {
    errors.link = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkParameter" />;
  }

  return errors;
}
