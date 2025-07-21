import React from 'react';
import PropTypes from 'prop-types';
import CommonAdditionalCallNumbersFields from '../../common/CommonAdditionalCallNumbersFields';

const AdditionalCallNumbersItemLevelFields = (props) => (
  <CommonAdditionalCallNumbersFields {...props} />
);

AdditionalCallNumbersItemLevelFields.propTypes = {
  callNumberTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  onSwap: PropTypes.func.isRequired,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default AdditionalCallNumbersItemLevelFields;
