import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function validateNameAndCode(item) {
  const errors = {};

  if (!item.code) {
    errors.code = <FormattedMessage id="ui-inventory.fillIn" />;
  }
  if (!item.name) {
    errors.name = <FormattedMessage id="ui-inventory.fillIn" />;
  }

  return errors;
}
