import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

const ActionItem = ({
  id,
  icon,
  label,
  messageId,
  onClickHandler,
  isDisabled,
}) => {
  return (
    <Button
      id={id}
      disabled={isDisabled}
      onClick={onClickHandler}
      buttonStyle="dropdownItem"
    >
      <Icon icon={icon}>
        {label || <FormattedMessage id={messageId} />}
      </Icon>
    </Button>
  );
};

ActionItem.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.string.isRequired,
  label: PropTypes.any,
  messageId: PropTypes.string,
  onClickHandler: PropTypes.func,
  isDisabled: PropTypes.bool,
};

ActionItem.defaultTypes = {
  label: null,
  isDisabled: false,
};

export default ActionItem;
