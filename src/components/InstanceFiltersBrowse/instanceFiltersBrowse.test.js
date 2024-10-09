import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { ModuleHierarchyProvider } from '@folio/stripes/core';
import { browseModeOptions } from '@folio/stripes-inventory-components';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';

import InstanceFiltersBrowse from './InstanceFiltersBrowse';

const mockOnChange = jest.fn();
const mockOnClear = jest.fn();

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
  subjectSources: [{ id: 'sourceId', name: 'source'}],
  subjectTypes: [{ id: 'typeId', name: 'type'}],
  locations: [],
  consortiaTenants,
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
          onClear={mockOnClear}
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

  it('Contains a filter for creation date ', () => {
    renderInstanceFilters();

    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  describe('when call numbers browseType was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          qindex: browseModeOptions.CALL_NUMBERS,
        },
      });

      expect(getByText('effectiveLocation-field')).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CALL_NUMBERS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('when call numbers browse sub-type was selected', () => {
    it('should display filter by effective location accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          qindex: browseModeOptions.DEWEY,
        },
      });

      expect(getByText('effectiveLocation-field')).toBeInTheDocument();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.DEWEY,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('When callNumber browseType was selected', () => {
    it('should call onClear handler if clear btn is clicked', () => {
      renderInstanceFilters();
      fireEvent.click(screen.getByLabelText('Clear selected Effective location (item) filters'));

      expect(mockOnClear).toHaveBeenCalled();
    });

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
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('when "Classification (all)" browse sub-type was selected', () => {
    it('should display "Shared" facet', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CLASSIFICATION_ALL,
        },
      });

      expect(getByText('Shared')).toBeInTheDocument();
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
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.CONTRIBUTORS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Held by filters'));

      expect(getByText('Held by')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
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

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Subject source"'));

      expect(getByRole('heading', { name: 'Subject source' })).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display filter by subjectType accordion', () => {
      const { getByRole } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected filters for "Subject type"'));

      expect(getByRole('heading', { name: 'Subject type' })).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should display shared filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Shared filters'));

      expect(getByText('Shared')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it.skip('should display Held by filter accordion', () => {
      const { getByText } = renderInstanceFilters({
        data,
        query: {
          ...query,
          qindex: browseModeOptions.SUBJECTS,
        },
      });

      fireEvent.click(screen.getByLabelText('Clear selected Held by filters'));

      expect(getByText('Held by')).toBeInTheDocument();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });
});

