import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { ModuleHierarchyProvider } from '@folio/stripes/core';
import {
  browseModeOptions,
  FACETS,
} from '@folio/stripes-inventory-components';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';

import InstanceFiltersBrowse from './InstanceFiltersBrowse';

const mockOnChange = jest.fn();

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
  subjectSources: [{ id: 'sourceId', name: 'source' }],
  subjectTypes: [{ id: 'typeId', name: 'type' }],
  locations: [],
  consortiaTenants,
  classificationBrowseConfig: [],
  callNumberBrowseConfig: [],
};

const query = {
  qindex: browseModeOptions.CALL_NUMBERS,
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
  subjectSource: ['sourceId'],
  subjectType: ['typeId'],
};

const renderInstanceFilters = (props = {}) => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFiltersBrowse
          data={data}
          query={query}
          onChange={mockOnChange}
          {...props}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translations,
  );
};

describe('InstanceFiltersBrowse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when call numbers browseType was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          qindex: browseModeOptions.CALL_NUMBERS,
        },
      });

      expect(getByRole('heading', { name: 'Effective location (item)' })).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CALL_NUMBERS,
        },
      });

      expect(getByRole('heading', { name: 'Shared' })).toBeInTheDocument();
    });
  });

  describe('when call numbers browse sub-type was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          qindex: browseModeOptions.DEWEY,
        },
      });

      expect(getByRole('heading', { name: 'Effective location (item)' })).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.DEWEY,
        },
      });

      expect(getByRole('heading', { name: 'Shared' })).toBeInTheDocument();
    });
  });

  describe('When callNumber browseType was selected', () => {
    it('should display "Held By" facet accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CALL_NUMBERS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Held by filters'));

      expect(getByRole('heading', { name: 'Held by' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.CALL_NUMBERS_HELD_BY,
        values: [],
      });
    });
  });

  describe('when "Classification (all)" browse sub-type was selected', () => {
    it('should display "Shared" facet', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CLASSIFICATION_ALL,
        },
      });

      expect(getByRole('heading', { name: 'Shared' })).toBeInTheDocument();
    });
  });

  describe('When contributors browseType was selected', () => {
    it('should display filter by nameType accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Name type filters'));

      expect(getByRole('heading', { name: 'Name type' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.NAME_TYPE,
        values: [],
      });
    });

    it('should display shared filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByRole('heading', { name: 'Shared' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.CONTRIBUTORS_SHARED,
        values: [],
      });
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Held by filters'));

      expect(getByRole('heading', { name: 'Held by' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.CONTRIBUTORS_HELD_BY,
        values: [],
      });
    });
  });

  describe('When subjects browseType was selected', () => {
    it('should display filter by subjectSource accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Subject source filters'));

      expect(getByRole('heading', { name: 'Subject source' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should display filter by subjectType accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Subject type filters'));

      expect(getByRole('heading', { name: 'Subject type' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should display shared filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByRole('heading', { name: 'Shared' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.SUBJECTS_SHARED,
        values: [],
      });
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Held by filters'));

      expect(getByRole('heading', { name: 'Held by' })).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.SHARED,
        values: [],
      });
    });
  });
});

