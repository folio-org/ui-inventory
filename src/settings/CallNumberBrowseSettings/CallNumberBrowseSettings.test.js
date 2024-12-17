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

import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import CallNumberBrowseSettings from './CallNumberBrowseSettings';

import { useCallNumberTypesQuery } from '../../hooks';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallNumberTypesQuery: jest.fn(),
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

const renderCallNumberBrowseSettings = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <CallNumberBrowseSettings
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
  translationsProperties
);

describe('CallNumberBrowseSettings', () => {
  beforeEach(() => {
    useCallNumberTypesQuery.mockClear().mockReturnValue({
      callNumberTypes: [],
      isLoading: false,
    });
  });

  describe('when data is still loading', () => {
    beforeEach(() => {
      useCallNumberTypesQuery.mockClear().mockReturnValue({
        callNumberTypes: [],
        isLoading: true,
      });
    });

    it('should not render the settings page', () => {
      const { queryByText } = renderCallNumberBrowseSettings();

      expect(queryByText('Call number browse')).not.toBeInTheDocument();
    });
  });

  describe('when user does not have central tenant permissions', () => {
    beforeEach(() => {
      useCallNumberTypesQuery.mockClear().mockReturnValue({
        callNumberTypes: [],
        isLoading: false,
      });

      useStripes.mockClear().mockReturnValue(buildStripes({
        hasPerm: () => false,
      }));
    });

    it('should not render the settings page', () => {
      const { queryByText } = renderCallNumberBrowseSettings();

      expect(queryByText('Call number browse')).not.toBeInTheDocument();
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
      useCallNumberTypesQuery.mockClear().mockReturnValue({
        callNumberTypes: [{
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
      const { container } = renderCallNumberBrowseSettings();

      await runAxeTest({
        rootNode: container,
      });
    });

    it('should render the settings page', () => {
      const { getAllByText } = renderCallNumberBrowseSettings();

      expect(getAllByText('Call number browse')).toBeDefined();
    });

    it('should render Call number browse config name', () => {
      const { getByText } = renderCallNumberBrowseSettings();

      expect(getByText('Call numbers (all)')).toBeInTheDocument();
    });

    it('should render Call number type names', () => {
      const { getByText } = renderCallNumberBrowseSettings();

      expect(getByText('Type 1')).toBeInTheDocument();
      expect(getByText('Type 2')).toBeInTheDocument();
    });

    it('should not render "+ New" button', () => {
      const { queryByText } = renderCallNumberBrowseSettings();

      expect(queryByText('+ New')).not.toBeInTheDocument();
    });
  });
});
