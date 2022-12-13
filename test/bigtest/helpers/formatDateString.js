import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

const formatDateString = string => {
  const date = moment.utc(string);

  return date.format(DATE_FORMAT);
};

export default formatDateString;
