import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { act } from 'react-dom/test-utils';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';
import DataContext from '../../contexts/DataContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';
import { instance } from '../../../test/fixtures';
import useInstance from '../../common/hooks/useInstance';
import InstanceEdit from './InstanceEdit';

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
            mutator={{
              instanceEdit: {
                GET: () => new Promise(resolve => resolve([instance])),
                PUT: () => new Promise((resolve, reject) => reject(new Error('error'))),
                reset: noop,
              },
            }}
          />
        </StripesContext.Provider>
      </DataContext.Provider>
    </QueryClientProvider>
  </Router>
);

describe('InstanceEdit', () => {
  beforeEach(async () => {
    useInstance.mockReturnValue({
      isLoading: false,
      instance: mockInstance,
    });
    await act(async () => {
      await renderWithIntl(<InstanceEditSetup />, translations);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saving instance', () => {
    beforeEach(async () => {
      await act(async () => {
        await fireEvent.change(screen.getByRole('textbox', { name: /resource title/i }), { target: { value: 'new title' } });
        fireEvent.click(screen.getByText(/Save & close/i));
      });
    });

    it('should show error modal', () => {
      expect(screen.getByRole('heading', { name: /saving instance failed/i })).toBeInTheDocument();
    });
  });
});
