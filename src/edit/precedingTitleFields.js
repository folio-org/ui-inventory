import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { RepeatableField } from '@folio/stripes/components';

import {
  ConnectedTitle,
  UnconnectedTitle,
} from '../components';

const PrecedingTitles = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const fieldRenderer = (field, index, fields) => {
    const {
      value,
      update,
    } = fields;
    const instance = value[index];

    return instance.precedingInstanceId ?
      <ConnectedTitle
        instance={instance}
        onSelect={inst => update(index, inst)}
      /> :
      <UnconnectedTitle
        field={field}
        onSelect={inst => update(index, inst)}
      />;
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-inventory.addPrecedingTitle" />}
      legend={<FormattedMessage id="ui-inventory.precedingTitles" />}
      id="clickable-add-precedingTitle"
      component={RepeatableField}
      name="precedingTitles"
      canAdd={canAdd}
      canRemove={canDelete}
      canEdit={canEdit}
      renderField={fieldRenderer}
    />
  );
};

PrecedingTitles.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
PrecedingTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PrecedingTitles;
