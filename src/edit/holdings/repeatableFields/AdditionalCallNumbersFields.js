import React from 'react';
import PropTypes from 'prop-types';
import CommonAdditionalCallNumbersFields from '../../common/CommonAdditionalCallNumbersFields';

const AdditionalCallNumbersFields = (props) => (
  <CommonAdditionalCallNumbersFields {...props} />
);

AdditionalCallNumbersFields.propTypes = {
  callNumberTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onSwap: PropTypes.func.isRequired,
};

export default AdditionalCallNumbersFields;
