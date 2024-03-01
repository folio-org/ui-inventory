import {
  useEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';

import { FACETS } from '../../constants';

const useStaffSuppressInitialValue = (onChange, query) => {
  const location = useLocation();
  const isQueryFiltersSet = Boolean(query.filters);
  const isDefaultValueSet = useRef(false);

  const hasFilters = new URLSearchParams(location.search).get('filters')?.length > 0;

  useEffect(() => {
    if (isDefaultValueSet.current) {
      return;
    }

    // need to wait until query.filters is set because calling onChange before that happens will override filters that are coming from location.search
    if (!isQueryFiltersSet && hasFilters) {
      return;
    }

    onChange({
      name: FACETS.STAFF_SUPPRESS,
      values: ['false'],
    });
    isDefaultValueSet.current = true;
  }, [isQueryFiltersSet]);
};

export default useStaffSuppressInitialValue;
