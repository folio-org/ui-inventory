import { useEffect, useRef } from 'react';

import { FACETS } from '../../constants';

const useStaffSuppressInitialValue = (onChange, query) => {
  const isFiltersFirstSet = useRef(Boolean(query.filters));

  useEffect(() => {
    isFiltersFirstSet.current = Boolean(query.filters);
  }, [query.filters]);

  useEffect(() => {
    // need to wait until query.filters is set because calling onChange before that happens will override filters that are coming from location.search
    if (!isFiltersFirstSet.current) {
      return;
    }

    onChange({
      name: FACETS.STAFF_SUPPRESS,
      values: ['false'],
    });
  }, [isFiltersFirstSet.current]);
};

export default useStaffSuppressInitialValue;
