import { FormattedMessage } from 'react-intl';

import { isEmpty } from 'lodash';

export const validateUniqueness = (
  index,
  item,
  items,
  field,
) => {
  return (
    items.some((entry, i) => (
      i !== index
      && !isEmpty(item[field]) && item[field]?.toLocaleLowerCase() === entry[field]?.toLocaleLowerCase()
    ))
      ? <FormattedMessage id="ui-inventory.validation.error.mustBeUnique" />
      : undefined
  );
};
