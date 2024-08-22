import { FormattedMessage } from 'react-intl';

export const validateUniqueness = (
  index,
  item,
  items,
  field,
) => {
  return (
    items.some((entry, i) => (
      i !== index
      && item[field]?.toLocaleLowerCase() === entry[field]?.toLocaleLowerCase()
    ))
      ? <FormattedMessage id="ui-inventory.validation.error.mustBeUnique" />
      : undefined
  );
};
