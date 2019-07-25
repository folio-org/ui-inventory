/**
 * Primary Toggle Button
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import { Button, Label } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const PrimaryToggleButton = ({
  label,
  meta: {
    dispatch,
    form
  },
  input: {
    value,
    onChange
  },
  fields,
  disabled,
}) => {
  const isPrimary = value === true;
  const handleClick = () => {
    if (isPrimary) {
      return;
    }

    // Reset other primary fields
    fields.forEach(fieldName => dispatch(change(form, `${fieldName}.primary`, false)));

    // Set primary flag for current field
    onChange(true);
  };

  return (
    <Fragment>
      { label && <Label>{label}</Label>}
      <Button
        data-test-primary-toggle-button
        buttonStyle={isPrimary ? 'primary' : 'default'}
        onClick={handleClick}
        type="button"
        disabled={disabled}
        fullWidth
      >
        <FormattedMessage id={`ui-inventory.${isPrimary ? 'primary' : 'makePrimary'}`} />
      </Button>
    </Fragment>
  );
};

PrimaryToggleButton.propTypes = {
  fields: PropTypes.shape({
    forEach: PropTypes.func,
  }).isRequired,
  label: PropTypes.node,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.any,
  }).isRequired,
  meta: PropTypes.shape({
    form: PropTypes.string,
    dispatch: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default PrimaryToggleButton;
