import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties,
} from '../../../test/jest/helpers';

import '../../../test/jest/__mock__';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import ClassificationBrowseSettings from './ClassificationBrowseSettings';

import {
  useClassificationIdentifierTypes,
  useUserTenantPermissions,
} from '../../hooks';

jest.unmock('@folio/stripes/components');
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useClassificationIdentifierTypes: jest.fn(),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
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

      expect(queryByText('ControlledVocab')).not.toBeInTheDocument();
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

      expect(queryByText('ControlledVocab')).not.toBeInTheDocument();
    });
  });

  describe('when data is loaded', () => {
    beforeEach(() => {
      useClassificationIdentifierTypes.mockClear().mockReturnValue({
        classificationTypes: [],
        isLoading: false,
      });
      useUserTenantPermissions.mockClear().mockReturnValue({
        userPermissions: [],
        isFetching: false,
      });

      useStripes.mockClear().mockReturnValue(buildStripes({
        hasInterface: () => false,
        hasPerm: () => true,
      }));
    });

    it('should render the settings page', () => {
      const { getByText } = renderClassificationBrowseSettings();

      expect(getByText('ControlledVocab')).toBeInTheDocument();
    });
  });
});
