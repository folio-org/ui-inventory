import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  FilterAccordionHeader,
  Accordion,
} from '@folio/stripes/components';
import { IfInterface } from '@folio/stripes/core';

import CheckboxFacet from '../CheckboxFacet';
import { FACETS, FACETS_OPTIONS } from '../../constants';

const HeldByFacet = ({
  activeFilters,
  facetsOptions,
  getIsPending,
  name,
  onChange,
  onClear,
  onFetchFacets,
  onFilterSearch,
}) => {
  const intl = useIntl();

  return (
    <IfInterface name="consortia">
      <Accordion
        closedByDefault
        label={intl.formatMessage({ id: `ui-inventory.filters.${FACETS.HELD_BY}` })}
        id={name}
        name={name}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={activeFilters[name]?.length > 0}
        onClearFilter={() => onClear(name)}
      >
        <CheckboxFacet
          name={name}
          dataOptions={facetsOptions[FACETS_OPTIONS.HELD_BY_OPTIONS] || []}
          selectedValues={activeFilters[name]}
          isPending={getIsPending(name)}
          onChange={onChange}
          isFilterable
          onSearch={onFilterSearch}
          onFetch={onFetchFacets}
        />
      </Accordion>
    </IfInterface>
  );
};

HeldByFacet.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  facetsOptions: PropTypes.object.isRequired,
  getIsPending: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onFetchFacets: PropTypes.func.isRequired,
  onFilterSearch: PropTypes.func.isRequired,
};

export default HeldByFacet;
