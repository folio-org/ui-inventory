import { FormattedMessage } from 'react-intl';

export default function validateLinkText(item) {
  const errors = {};

  if (!item.linkText) {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextRequired" />;
  }

  if (item?.linkText?.length > 40) {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextTooLong" />;
  }

  if (item?.linkText?.trim() === '') {
    errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLinks.error.linkTextBlank" />;
  }

  return errors;
}
