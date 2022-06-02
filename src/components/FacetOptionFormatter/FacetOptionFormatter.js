import PropTypes from 'prop-types';

import { OptionSegment } from '@folio/stripes/components';

import styles from './FacetOptionFormatter.css';

const propTypes = {
  option: PropTypes.object,
  searchTerm: PropTypes.string,
};

const FacetOptionFormatter = ({ option, searchTerm }) => {
  if (!option) {
    return null;
  }

  const formatTotalRecords = totalRecords => `(${totalRecords})`;

  return (
    <OptionSegment searchTerm={searchTerm}>
      <span className={styles.optionLabel}>{option.label}</span>
      <span className={styles.totalRecordsLabel}>{formatTotalRecords(option.totalRecords)}</span>
    </OptionSegment>
  );
};

FacetOptionFormatter.propTypes = propTypes;

FacetOptionFormatter.defaultProps = {
  option: null,
  searchTerm: '',
};

export default FacetOptionFormatter;
