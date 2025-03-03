import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { MarcVersionHistory } from './MarcVersionHistory';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useMarcAuditDataQuery: () => jest.fn(),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const marcId = 'marcId';

const renderMarcVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <MarcVersionHistory
        id={marcId}
        onClose={onCloseMock}
      />
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MarcVersionHistory', () => {
  it('should render Version history pane', () => {
    renderMarcVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});

