import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import InstanceVersionHistory from './InstanceVersionHistory';
import { DataContext } from '../../contexts';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useInstanceAuditDataQuery: () => jest.fn(),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const instanceId = 'instanceId';
const mockReferenceData = {
  alternativeTitleTypes: [],
  classificationTypes: [],
  contributorNameTypes: [],
  contributorTypes: [],
  instanceDateTypes: [],
  identifierTypes: [],
  instanceFormats: [],
  instanceNoteTypes: [],
  instanceTypes: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  electronicAccessRelationships: [],
  subjectSources: [],
  statisticalCodes: [],
  instanceStatuses: [],
  subjectTypes:[],
};

const renderInstanceVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <InstanceVersionHistory
          instanceId={instanceId}
          onClose={onCloseMock}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceVersionHistory', () => {
  it('should render View history pane', () => {
    renderInstanceVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});

