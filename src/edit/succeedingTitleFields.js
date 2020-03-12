import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { RepeatableField } from '@folio/stripes/components';

import { TitleField } from '../components';

const SucceedingTitles = ({ canAdd, canEdit, canDelete }) => (
  <FieldArray
    addLabel={<FormattedMessage id="ui-inventory.addSucceedingTitle" />}
    legend={<FormattedMessage id="ui-inventory.succeedingTitles" />}
    id="clickable-add-succeedingTitle"
    component={RepeatableField}
    name="succeedingTitles"
    canAdd={canAdd}
    canRemove={canDelete}
    canEdit={canEdit}
    renderField={(field, index, fields) => <TitleField field={field} index={index} fields={fields} titleIdKey="succeedingInstanceId" />}
  />
);

SucceedingTitles.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

SucceedingTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default SucceedingTitles;
