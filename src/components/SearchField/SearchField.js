/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import TextFieldIcon from '@folio/stripes-components/lib/TextField/TextFieldIcon';

import ElasticQueryField from '../ElasticQueryField';
import css from './SearchField.css';

// Accepts the same props as TextField
const propTypes = {
  ariaLabel: PropTypes.string,
  booleanOperators: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  clearSearchId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputClass: PropTypes.string,
  inputRef: PropTypes.object,
  isAdvancedSearch: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onClear: PropTypes.func,
  operators: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  })),
  searchableIndexesES: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  searchableIndexesPlaceholder: PropTypes.string,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  selectedIndex: PropTypes.string,
  setIsSearchByKeyword: PropTypes.func,
  value: PropTypes.string,
};

const SearchField = (props) => {
  const {
    className,
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    onClear,
    setIsSearchByKeyword,
    loading,
    clearSearchId,
    searchableIndexes,
    searchableIndexesES,
    operators,
    booleanOperators,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
    inputClass,
    disabled,
    isAdvancedSearch,
    searchButtonRef,
    ...rest
  } = props;

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);
  const intl = useIntl();

  if (hasSearchableIndexes) {
    const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });

    searchableIndexesDropdown = (
      <Select
        aria-label={indexLabel}
        dataOptions={searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        placeholder={searchableIndexesPlaceholder}
        selectClass={css.select}
        value={selectedIndex}
      />
    );
  }

  // Wrapper styles
  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
    className,
  );

  // Search icon
  const searchIcon = (<TextFieldIcon iconClassName={css.searchIcon} icon="search" />);

  // Placeholder
  let inputPlaceholder = placeholder;
  if (!placeholder && hasSearchableIndexes && selectedIndex) {
    const selectedIndexConfig = searchableIndexes.find(index => index.value === selectedIndex) || {};
    inputPlaceholder = selectedIndexConfig.placeholder || '';
  }

  return (
    <div className={rootStyles}>
      {isAdvancedSearch
        ? (
          <ElasticQueryField
            ariaLabel={rest['aria-label'] || ariaLabel}
            booleanOperators={booleanOperators}
            onChange={onChange}
            operators={operators}
            searchButtonRef={searchButtonRef}
            searchOptions={searchableIndexesES}
            setIsSearchByKeyword={setIsSearchByKeyword}
            value={value}
          />
        )
        : (
          <>
            {searchableIndexesDropdown}
            <TextField
              {...rest}
              aria-label={rest['aria-label'] || ariaLabel}
              clearFieldId={clearSearchId}
              disabled={disabled}
              focusedClass={css.isFocused}
              id={id}
              hasClearIcon={typeof onClear === 'function' && loading !== true}
              inputClass={classNames(css.input, inputClass)}
              loading={loading}
              onChange={onChange}
              onClearField={onClear}
              placeholder={inputPlaceholder}
              startControl={!hasSearchableIndexes ? searchIcon : null}
              type="search"
              value={value || ''}
              readOnly={loading || rest.readOnly}
            />
          </>
        )
      }
    </div>
  );
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = {
  loading: false,
};

export default SearchField;
