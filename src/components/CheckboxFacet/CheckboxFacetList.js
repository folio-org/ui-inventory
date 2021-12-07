import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  TextField,
  Button,
  Icon,
} from '@folio/stripes-components';

import css from './CheckboxFacetList.css';

function CheckboxFacetList({
  dataOptions,
  selectedValues,
  showMore,
  showSearch,
  onMoreClick,
  onSearch,
  onChange,
  onFetch,
  fieldName,
  isPending,
}) {
  const handleTextFieldFocus = () => {
    onFetch({ focusedFacet: fieldName });
  };

  return (
    <div className={css.facetSearchContainer}>
      {showSearch && (
        <div className={css.facetSearch}>
          <TextField
            type="search"
            onChange={(e) => onSearch(e.target.value)}
            onFocus={handleTextFieldFocus}
          />
        </div>
      )}
      <div>
        {isPending &&
          <Icon icon="spinner-ellipsis" size="small" />
        }
        {!isPending && dataOptions.length < 1 &&
          <FormattedMessage id="ui-inventory.noMatchingOptions" />
        }

        {!isPending && dataOptions.map(({ count, value, label, disabled, readOnly }) => {
          const name = typeof label === 'string' ? label : value;
          return (
            <Checkbox
              id={`clickable-filter-${fieldName}-${kebabCase(name)}`}
              data-test-checkbox-filter-data-option={value}
              key={value}
              label={label}
              labelInfo={count}
              name={name}
              disabled={disabled}
              readOnly={readOnly}
              checked={selectedValues.includes(value)}
              onChange={onChange(value)}
            />
          );
        })}
      </div>

      {!isPending && showMore && (

        <FormattedMessage id="ui-inventory.showMoreOptions">
          { ({ label }) => (
            <Button
              buttonStyle="link bottomMargin0"
              onClick={onMoreClick}
              aria-label={label}
              icon="plus-sign"
              size="small"
            >
              <Icon
                aria-label={label}
                iconClassName={css.moreIcon}
                icon="plus-sign"
                size="small"
              />
              <FormattedMessage id="ui-inventory.more" />
            </Button>
          )}
        </FormattedMessage>
      )}
    </div>
  );
}

CheckboxFacetList.propTypes = {
  fieldName: PropTypes.string.isRequired,
  isPending: PropTypes.bool,
  onMoreClick: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    label: PropTypes.node,
    readOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: PropTypes.number,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func,
  selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  showMore: PropTypes.bool.isRequired,
  showSearch: PropTypes.bool,
};

CheckboxFacetList.defaultProps = {
  onFetch: () => null,
};

export default CheckboxFacetList;
