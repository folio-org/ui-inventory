import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';
import DataContext from '../../contexts/DataContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';
import { instance } from '../../../test/fixtures';
import useInstance from '../../common/hooks/useInstance';
import InstanceEdit from './InstanceEdit';
import { useInstanceMutation } from '../hooks';

jest.mock('../hooks', () => ({
  useInstanceMutation: jest.fn().mockReturnValue({ mutateInstance: jest.fn() }),
}));

const queryClient = new QueryClient();
const referenceData = {
  locationsById: {},
  identifierTypesById: {},
  identifierTypesByName: {},
  statisticalCodes: [],
  classificationTypes: [],
  instanceNoteTypes: [],
  electronicAccessRelationships: [],
  contributorNameTypes: [],
  contributorTypes: [],
  identifierTypes: [],
  alternativeTitleTypes: [],
  subjectSources: [],
  subjectTypes: [],
};
const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};
const mockInstance = {
  ...instance,
  shared: false,
  tenantId: 'tenantId',
};
jest.mock('../../common/hooks/useInstance', () => jest.fn());

const InstanceEditSetup = () => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={referenceData}>
        <StripesContext.Provider value={stripesStub}>
          <InstanceEdit
            referenceData={referenceData}
            instanceId={instance.id}
          />
        </StripesContext.Provider>
      </DataContext.Provider>
    </QueryClientProvider>
  </Router>
);

const renderInstanceEdit = () => renderWithIntl(<InstanceEditSetup />, translations);

describe('InstanceEdit', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    useInstanceMutation.mockClear().mockReturnValue({ mutateInstance: mockMutate });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when instance is loading', () => {
    beforeEach(() => {
      useInstance.mockReturnValue({ isFetching: true });
    });

    it('should render loading icon', () => {
      const { getByText } = renderInstanceEdit();

      expect(getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('when instance is not found', () => {
    beforeEach(() => {
      useInstance.mockReturnValue({
        isFetching: false,
        instance: null,
      });
    });

    it('should render empty container', () => {
      const { container } = renderInstanceEdit();

      expect(container.children.length).toBe(0);
    });
  });

  describe('when edit instance and save changes', () => {
    beforeEach(() => {
      useInstance.mockReturnValue({
        isFetching: false,
        instance: mockInstance,
      });
    });

    it('should call mutation request', () => {
      const {
        getByRole,
        getByText,
      } = renderInstanceEdit();

      const resourceTitleField = getByRole('textbox', { name: /resource title/i });

      fireEvent.change(resourceTitleField, { target: { value: 'new title' } });
      fireEvent.click(getByText(/Save & close/i));

      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
