import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { filterItemsBy } from '../../utils';

export default class ItemFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    data: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {},
    data: {
      materialTypes: [],
    },
  }

  render() {
    const {
      activeFilters: {
        materialType = [],
      },
      data: {
        materialTypes,
      },
      onChange,
      onClear,
    } = this.props;

    const materialTypesOptions = materialTypes.map(({ name, id }) => ({
      label: name,
      value: id,
    }));

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-inventory.materialType" />}
          id="materialTypeAccordion"
          name="materialTypeAccordion"
          separator
          closedByDefault
          header={FilterAccordionHeader}
          displayClearButton={!isEmpty(materialType)}
          onClearFilter={() => onClear('materialType')}
        >
          <MultiSelectionFilter
            name="materialType"
            id="materialTypeFilter"
            dataOptions={materialTypesOptions}
            selectedValues={materialType}
            filter={filterItemsBy('label')}
            onChange={onChange}
          />
        </Accordion>
      </React.Fragment>
    );
  }
}
