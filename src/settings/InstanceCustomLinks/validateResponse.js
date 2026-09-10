import { FormattedMessage } from 'react-intl';

export default function validateResponse(item, responses) {
  const errors = {};

  responses.forEach(response => {
    if (response.code === 'unique') {
      const val = response.parameters?.[0]?.value;
      switch (response.parameters?.[0]?.key) {
        case 'linkText':
          if (item.linkText === val) {
            errors.linkText = <FormattedMessage id="ui-inventory.instanceCustomLink.error.linkTextUnique" />;
          }
          break;
        case 'baseUrl':
          if (item.baseUrl === val) {
            errors.baseUrl = <FormattedMessage id="ui-inventory.instanceCustomLink.error.baseUrlUnique" />;
          }
          break;
        case 'name':
          if (item.name === val) {
            errors.name = <FormattedMessage id="ui-inventory.instanceCustomLink.error.nameUnique" />;
          }
          break;
        default:
          break;
      }
    }
  });

  return errors;
}
