import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import CheckboxFacet from '../CheckboxFacet';
import DataContext from '../../contexts/DataContext';
import { useLocationsOfAllTenantsQuery } from '../../hooks';
import { getFacetOptions } from '../../facetUtils';
import { isUserInConsortiumMode } from '../../utils';

const EffectiveLocationFacet = ({
  closedByDefault,
  open,
  selectedOptions,
  facetOptions,
  isLoadingFacets,
  name,
  onChange,
  onClear,
  onFetchFacets,
  onFilterSearch,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const { allTenantIds } = useContext(DataContext);

  const {
    data: locationsOfAllTenants,
    isLoading: isLoadingAllLocations,
  } = useLocationsOfAllTenantsQuery({ tenantIds: allTenantIds, enabled: open });

  const isLoadingOptions = isLoadingFacets || isLoadingAllLocations;
  const dataOptions = isUserInConsortiumMode(stripes)
    ? getFacetOptions(selectedOptions, facetOptions, locationsOfAllTenants, 'id')
    : facetOptions;

  return (
    <Accordion
      closedByDefault={closedByDefault}
      label={intl.formatMessage({ id: `ui-inventory.filters.${name}` })}
      id={name}
      name={name}
      separator={false}
      header={FilterAccordionHeader}
      displayClearButton={selectedOptions?.length > 0}
      onClearFilter={() => onClear(name)}
    >
      <CheckboxFacet
        name={name}
        dataOptions={dataOptions}
        selectedValues={selectedOptions}
        onChange={onChange}
        onSearch={onFilterSearch}
        isFilterable
        isPending={isLoadingOptions}
        onFetch={onFetchFacets}
      />
    </Accordion>
  );
};

EffectiveLocationFacet.defaultProps = {
  closedByDefault: true,
  isLoadingFacets: false,
  selectedOptions: [],
  facetOptions: [],
};

EffectiveLocationFacet.propTypes = {
  closedByDefault: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  facetOptions: PropTypes.arrayOf(PropTypes.object),
  isLoadingFacets: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onFetchFacets: PropTypes.func.isRequired,
  onFilterSearch: PropTypes.func.isRequired,
};

export default EffectiveLocationFacet;
