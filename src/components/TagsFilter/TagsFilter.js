import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

const FILTER_NAME = 'tags';

function TagsFilter({ onChange, onClear, selectedValues, tagsRecords }) {
  const intl = useIntl();
  const onClearFilter = useCallback(() => onClear(FILTER_NAME), [onClear]);

  const tagsOptions = tagsRecords
    .map(({ label }) => ({ label, value: label }))
    .sort((a, b) => a.label.localeCompare((b.label)));
  const noTagsSelected = selectedValues?.length === 0;

  return (
    <Accordion
      closedByDefault={noTagsSelected}
      displayClearButton={!noTagsSelected}
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
  tagsRecords: [],
};

export default TagsFilter;
