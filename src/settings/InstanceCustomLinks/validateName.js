import { FormattedMessage } from 'react-intl';

export default function validateName(item) {
  const errors = {};

  if (!item.name) {
    errors.name = <FormattedMessage id="ui-inventory.fillIn" />;
  }

  if (item.name && item.name.length > 150) {
    errors.name = <FormattedMessage id="ui-inventory.instanceCustomLink.error.nameTooLong" />;
  }

  return errors;
}
