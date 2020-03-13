import React from 'react';
import PropTypes from 'prop-types';

import {
  ConnectedTitle,
  UnconnectedTitle,
} from '..';

const TitleField = ({ field, index, fields, titleIdKey }) => {
  const {
    value,
    update,
  } = fields;
  const instance = value[index];
  const {
    precedingInstanceId,
    succeedingInstanceId,
    connected,
  } = instance;

  const isConnected = connected || (precedingInstanceId && succeedingInstanceId);

  const handleSelect = (inst) => {
    update(index, {
      ...inst,
      [titleIdKey]: inst.id,
      connected: true,
    });
  };

  return isConnected ?
    <ConnectedTitle
      instance={instance}
      onSelect={handleSelect}
      titleIdKey={titleIdKey}
    /> :
    <UnconnectedTitle
      field={field}
      onSelect={handleSelect}
    />;
};

TitleField.propTypes = {
  field: PropTypes.object,
  fields: PropTypes.object,
  index: PropTypes.number,
  titleIdKey: PropTypes.string,
};

export default TitleField;
