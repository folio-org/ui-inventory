import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import {
  Accordion,
  FilterAccordionHeader,
  filterState,
} from '@folio/stripes/components';
import {
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

const FILTER_NAME = 'tags';

function TagsFilter({ onChange, onClear, selectedValues, tagsRecords }) {
  const intl = useIntl();
  const onClearFilter = useCallback(() => onClear(FILTER_NAME), [onClear]);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const hasTagsSelected = !!Object.keys(filterState(urlParams.get('filters')))
    .find((key) => key.startsWith(`${FILTER_NAME}.`));

  const tagsOptions = tagsRecords
    .map(({ label }) => ({ label, value: label }))
    .sort((a, b) => a.label.localeCompare((b.label)));

  return (
    <Accordion
      closedByDefault={!hasTagsSelected}
      displayClearButton={selectedValues?.length}
      header={FilterAccordionHeader}
      label={intl.formatMessage({ id: 'ui-inventory.filter.tags' })}
      onClearFilter={onClearFilter}
    >
      <MultiSelectionFilter
        dataOptions={tagsOptions}
        name={FILTER_NAME}
        onChange={onChange}
        selectedValues={selectedValues}
      />
    </Accordion>
  );
}

TagsFilter.propTypes = {
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  tagsRecords: PropTypes.arrayOf(PropTypes.object),
};

TagsFilter.defaultProps = {
  selectedValues: [],
  tagsRecords: [],
};

export default TagsFilter;
