import PropTypes from 'prop-types';

import { List } from '@folio/stripes/components';

export const CallNumberTypeList = ({ typeIds = [] }) => {
  return (
    <List
      items={typeIds}
      itemFormatter={type => <li>{type?.label}</li>}
      listStyle="bullets"
      marginBottom0
    />
  );
};

CallNumberTypeList.propTypes = {
  typeIds: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
  })),
};
