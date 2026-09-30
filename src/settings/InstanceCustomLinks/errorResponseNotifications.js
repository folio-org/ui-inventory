import { FormattedMessage } from 'react-intl';

import {
  KNOWN_INSTANCE_CUSTOM_LINK_CODES,
  KNOWN_INSTANCE_CUSTOM_LINK_FIELDS,
  UNIQUE_FIELD_TO_ERROR,
} from '../../constants';

export default function errorResponseNotifications(callout, errors = []) {
  // getCustomErrorMessages prop on ControlledVocab is implemented such that
  // custom errors override form validation errors. Until they can interleave
  // instead of always deferring to backend response-derived errors, use callouts
  // to show response-derived errors, leaving in-form messages solely to validation.
  errors.forEach(error => {
    const key = error.parameters?.[0]?.key;
    const code = error.code;
    if (KNOWN_INSTANCE_CUSTOM_LINK_CODES.includes(code) &&
        key && KNOWN_INSTANCE_CUSTOM_LINK_FIELDS.includes(key)) {
      callout.sendCallout({ type: 'error', message: <FormattedMessage id={UNIQUE_FIELD_TO_ERROR[key]} /> });
    } else {
      const calloutMessage = key ? `${error.message} (${key})` : error.message;
      callout.sendCallout({ type: 'error', message: calloutMessage });
    }
  });

  return undefined;
}
