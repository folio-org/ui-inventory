/**
 * Primary Toggle Button
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Label } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const PrimaryToggleButton = ({
  label,
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

    fields.forEach((_, index) => {
      fields.update(index, { ...fields.value[index], primary: false });
    });

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
  disabled: PropTypes.bool.isRequired,
};

export default PrimaryToggleButton;
