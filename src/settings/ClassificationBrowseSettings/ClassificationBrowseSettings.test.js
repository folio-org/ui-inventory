import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  useStripes,
  useUserTenantPermissions,
} from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import '../../../test/jest/__mock__';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import ClassificationBrowseSettings from './ClassificationBrowseSettings';

import {
  useClassificationIdentifierTypes,
} from '../../hooks';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useClassificationIdentifierTypes: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({
    hasInterface: () => true,
    hasPerm: () => true,
    connect: component => component,
    user: {},
    okapi: {},
  }),
  useOkapiKy: jest.fn().mockReturnValue({
    get: jest.fn(),
    extend: jest.fn(),
  }),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
}));

const defaultProps = {
  stripes: buildStripes(),
};

const renderClassificationBrowseSettings = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <ClassificationBrowseSettings
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
  translationsProperties
);

describe('ClassificationBrowseSettings', () => {
  beforeEach(() => {
    useClassificationIdentifierTypes.mockClear().mockReturnValue({
      classificationTypes: [],
      isLoading: false,
    });
  });

  describe('when data is still loading', () => {
    beforeEach(() => {
      useClassificationIdentifierTypes.mockClear().mockReturnValue({
        classificationTypes: [],
        isLoading: true,
      });
    });

    it('should not render the settings page', () => {
      const { queryByText } = renderClassificationBrowseSettings();

      expect(queryByText('Classification browse')).not.toBeInTheDocument();
    });
  });

  describe('when user does not have central tenant permissions', () => {
    beforeEach(() => {
      useClassificationIdentifierTypes.mockClear().mockReturnValue({
        classificationTypes: [],
        isLoading: false,
      });

      useStripes.mockClear().mockReturnValue(buildStripes({
        hasPerm: () => false,
      }));
    });

    it('should not render the settings page', () => {
      const { queryByText } = renderClassificationBrowseSettings();

      expect(queryByText('Classification browse')).not.toBeInTheDocument();
    });
  });

  describe('when data is loaded', () => {
    const mutator = {
      values: {
        GET: jest.fn(),
      },
    };

    const resources = {
      values: {
        records: [{
          id: 'all',
          typeIds: ['type-1', 'type-2'],
        }],
      },
    };

    beforeEach(() => {
      useClassificationIdentifierTypes.mockClear().mockReturnValue({
        classificationTypes: [{
          id: 'type-1',
          name: 'Type 1',
        }, {
          id: 'type-2',
          name: 'Type 2',
        }],
        isLoading: false,
      });
      useUserTenantPermissions.mockClear().mockReturnValue({
        userPermissions: [],
        isFetching: false,
      });

      useStripes.mockClear().mockReturnValue(buildStripes({
        hasInterface: () => false,
        hasPerm: () => true,
        connect: Component => (props) => (
          <Component
            resources={resources}
            mutator={mutator}
            {...props}
          />
        ),
      }));
    });

    it('should render with no axe errors', async () => {
      const { container } = renderClassificationBrowseSettings();

      await runAxeTest({
        rootNode: container,
      });
    });

    it('should render the settings page', () => {
      const { getAllByText } = renderClassificationBrowseSettings();

      expect(getAllByText('Classification browse')).toBeDefined();
    });

    it('should render Classification browse config name', () => {
      const { getByText } = renderClassificationBrowseSettings();

      expect(getByText('Classification (all)')).toBeInTheDocument();
    });

    it('should render Classification identifier type names', () => {
      const { getByText } = renderClassificationBrowseSettings();

      expect(getByText('Type 1')).toBeInTheDocument();
      expect(getByText('Type 2')).toBeInTheDocument();
    });

    it('should not render "+ New" button', () => {
      const { queryByText } = renderClassificationBrowseSettings();

      expect(queryByText('+ New')).not.toBeInTheDocument();
    });
  });
});
