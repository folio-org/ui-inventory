import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  noop,
  cloneDeep,
} from 'lodash';
import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { ModuleHierarchyProvider } from '@folio/stripes/core';
import { browseModeOptions } from '@folio/stripes-inventory-components';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import InstanceFiltersBrowse from './InstanceFiltersBrowse';

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

const consortiaTenants = [
  {
    'id': 'consortium',
    'code': 'MCO',
    'name': 'Consortium',
    'isCentral': true
  },
  {
    'id': 'university',
    'code': 'UNI',
    'name': 'University',
    'isCentral': false
  },
  {
    'id': 'college',
    'code': 'COL',
    'name': 'College',
    'isCentral': false
  }
];

const data = {
  locations: [],
  query: [],
  onFetchFacets: noop,
  parentResources: resources,
  browseType: browseModeOptions.CALL_NUMBERS,
  consortiaTenants,
};

const activeFilters = {
  language: ['eng'],
  shared: ['true'],
  effectiveLocation: ['effectiveLocation1'],
  callNumbersTenantId: ['college'],
  contributorsShared: ['true'],
  contributorsTenantId: ['consortium'],
  classificationShared: ['true'],
  classificationTenantId: ['college'],
  subjectsShared: ['true'],
  subjectsTenantId: ['consortium'],
  nameType: ['nameType1'],
};

const renderInstanceFilters = (props = {}) => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFiltersBrowse
          activeFilters={activeFilters}
          data={data}
          onChange={mockOnChange}
          onClear={mockOnClear}
          {...props}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translations
  );
};

describe('InstanceFilters', () => {
  it('Contains a filter for creation date ', () => {
    renderInstanceFilters();

    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  describe('when call numbers browseType was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CALL_NUMBERS,
        },
      });

      expect(getByText('effectiveLocation-field')).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CALL_NUMBERS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Shared"'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('when call numbers browse sub-type was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.DEWEY,
        },
      });

      expect(getByText('effectiveLocation-field')).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.DEWEY,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Shared"'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('When callNumber browseType was selected', () => {
    it('should call onClear handler if clear btn is clicked', () => {
      renderInstanceFilters();
      fireEvent.click(screen.getByLabelText('Clear selected filters for "Effective location (item)"'));

      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display "Held By" facet accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CALL_NUMBERS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Held by"'));

      expect(getByRole('heading', { name: 'Held by' })).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display "Held By" facet options', () => {
      const newData = cloneDeep(data);
      newData.parentResources.facets.records = [{
        'holdings.tenantId': {
          'values': [
            {
              'id': 'university',
              'totalRecords': 3,
            },
            {
              'id': 'college',
              'totalRecords': 1,
            }
          ],
          'totalRecords': 2,
        },
      }];

      const { getByText } = renderInstanceFilters({
        data: newData,
      });

      expect(getByText('University')).toBeVisible();
      expect(getByText('College')).toBeVisible();
    });
  });

  describe('when "Classification (all)" browse sub-type was selected', () => {
    it('should display "Shared" facet', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CLASSIFICATION_ALL,
        },
      });

      expect(getByText('Shared')).toBeInTheDocument();
    });

    describe('when the "Shared" facet option with 0 count', () => {
      it('should be visible', () => {
        const parentResources = {
          facets: {
            records: [
              {
                'instances.shared': {
                  'values': [{
                    'id': 'false',
                    'totalRecords': 1,
                  }],
                  'totalRecords': 1
                },
              }
            ]
          }
        };

        const { getByText, getByRole } = renderInstanceFilters({
          activeFilters: {
            classificationShared: ['false', 'true'],
          },
          browseType: 'deweyClassification',
          data: {
            ...data,
            browseType: browseModeOptions.DEWEY_CLASSIFICATION,
            parentResources,
          },
        });

        fireEvent.click(getByText('Shared'));

        expect(getByRole('checkbox', { name: 'No 1' })).toBeVisible();
        expect(getByRole('checkbox', { name: 'Yes 0' })).toBeVisible();
      });
    });
  });

  describe('When contributors browseType was selected', () => {
    it('should display filter by nameType accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Name type"'));

      expect(getByRole('heading', { name: 'Name type' })).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Shared"'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Held by"'));

      expect(getByText('Held by')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('When subjects browseType was selected', () => {
    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Shared"'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data: {
          ...data,
          browseType: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Held by"'));

      expect(getByText('Held by')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });
});

