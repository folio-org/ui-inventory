import { PropTypes } from 'prop-types';
import { DateRangeFilter as StripesDateRangeFilter } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';
import moment from 'moment';

// Delegates rendering to DateRangeFilter from smart-components.
// Sets correct tenant timezone when onChange is executed.
const DateRangeFilter = ({ name, dateFormat, selectedValues, onChange, makeFilterString }) => {
  const { timezone } = useStripes();

  const onDateRangeChange = (filterData) => {
    // sets current tenant's timezone
    moment.tz.setDefault(timezone);
    onChange(filterData);
    // restore to a default timezone
    moment.tz.setDefault();
  };

  return <StripesDateRangeFilter
    name={name}
    dateFormat={dateFormat}
    selectedValues={selectedValues}
    onChange={onDateRangeChange}
    makeFilterString={makeFilterString}
  />;
};

DateRangeFilter.propTypes = {
  dateFormat: PropTypes.string,
  name: PropTypes.string.isRequired,
  makeFilterString: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedValues: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default DateRangeFilter;
