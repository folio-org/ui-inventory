import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { RepeatableField } from '@folio/stripes/components';

import { TitleField } from '../components';

const PrecedingTitles = ({ canAdd, canEdit, canDelete }) => (
  <FieldArray
    addLabel={<FormattedMessage id="ui-inventory.addPrecedingTitle" />}
    legend={<FormattedMessage id="ui-inventory.precedingTitles" />}
    id="clickable-add-precedingTitle"
    component={RepeatableField}
    name="precedingTitles"
    canAdd={canAdd}
    canRemove={canDelete}
    canEdit={canEdit}
    renderField={(field, index, fields) => <TitleField field={field} index={index} fields={fields} titleIdKey="precedingInstanceId" />}
  />
);

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
