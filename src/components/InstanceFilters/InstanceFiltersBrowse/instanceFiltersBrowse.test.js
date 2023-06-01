import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import InstanceFiltersBrowse from './InstanceFiltersBrowse';

jest.mock('../../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

const mockOnChange = jest.fn();
const mockOnClear = jest.fn();

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [{
      'id': 'd3c8b511-41e7-422e-a483-18778d0596e5',
      'label': 'important',
      'description': 'important',
    },
    {
      'id': 'b822d5a8-1750-4b5f-92bd-9fc73a05ddda',
      'label': 'new',
      'description': 'new',
    }],
    other: { totalRecords: 0 }
  },
};

const data = {
  locations: [],
  query: [],
  onFetchFacets: noop,
  parentResources: resources,
  browseType: 'callNumbers',
};

const renderInstanceFilters = (props = {}) => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFiltersBrowse
          activeFilters={{ 'language': ['eng'] }}
          data={data}
          onChange={mockOnChange}
          onClear={mockOnClear}
          parentResources={resources}
          {...props}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translations
  );
};

describe('InstanceFilters', () => {
  it('Contains a filter for creation date ', () => {
    const { debug } = renderInstanceFilters();

    debug();
    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  describe('When contributors browseType was selected', () => {
    it('should display filter by nameType accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: 'contributors',
        },
      });

      fireEvent.click(screen.getByText('Clear nameType'));

      expect(getByText('nameType')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('When callNumber browseType was selected', () => {
    it('should call onClear handler if clear btn is clicked', () => {
      renderInstanceFilters();
      fireEvent.click(screen.getByText('effectiveLocation-field'));

      expect(mockOnClear).toHaveBeenCalled();
    });
  });
});

