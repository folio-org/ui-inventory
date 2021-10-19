import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import {
  Accordion,
  FilterAccordionHeader,
  filterState,
} from '@folio/stripes/components';

import CheckboxFacet from '../CheckboxFacet';

const TagsFilter = ({
  id,
  name,
  onChange,
  onFetch,
  onSearch,
  onClear,
  selectedValues,
  tagsRecords,
  isPending,
}) => {
  const intl = useIntl();
  const onClearFilter = useCallback(() => onClear(name), [onClear, name]);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const hasTagsSelected = !!Object.keys(filterState(urlParams.get('filters')))
    .find((key) => key.startsWith(`${name}.`));

  const tagsOptions = tagsRecords.map(({ label, count }) => ({ label, value: label, count }));
  return (
    <Accordion
      id={id}
      closedByDefault={!hasTagsSelected}
      displayClearButton={!!selectedValues?.length}
      header={FilterAccordionHeader}
      label={intl.formatMessage({ id: 'ui-inventory.filter.tags' })}
      onClearFilter={onClearFilter}
    >
      <CheckboxFacet
        dataOptions={tagsOptions}
        name={name}
        onChange={onChange}
        onSearch={onSearch}
        onFetch={onFetch}
        selectedValues={selectedValues}
        isFilterable
        isPending={isPending}
      />
    </Accordion>
  );
};

TagsFilter.propTypes = {
  id: PropTypes.string,
  isPending: PropTypes.bool,
  name: PropTypes.string,
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onFetch: PropTypes.func,
  onSearch: PropTypes.func,
  tagsRecords: PropTypes.arrayOf(PropTypes.object),
};

TagsFilter.defaultProps = {
  selectedValues: [],
  tagsRecords: [],
};

export default TagsFilter;
