import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

export const validateRequiredField = value => {
  const isValid = !isEmpty(value);

  if (isValid) {
    return undefined;
  }

  return <FormattedMessage id="ui-inventory.hridHandling.validation.enterValue" />;
};

export const validateNumericField = value => {
  const pattern = /^\d{1,8}$/;

  if (value.match(pattern)) {
    return undefined;
  }

  return <FormattedMessage id="ui-inventory.hridHandling.validation.startWithField" />;
};

export const validateAlphaNumericField = value => {
  const pattern = /^[\w.,\-!?:;"'(){}\[\]$ ]{0,10}$/;

  if (value.match(pattern)) {
    return undefined;
  }

  return <FormattedMessage id="ui-inventory.hridHandling.validation.assignPrefixField" />;
};
