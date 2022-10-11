import '../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { useHistory } from 'react-router-dom';

import { instance } from '../../../test/fixtures/instance';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseResultsList from './BrowseResultsList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => ({ push: jest.fn() })),
  useLocation: jest.fn(() => ({ search: 'qindex="callNumbers"&query="A"' })),
}));

const defaultProps = {
  browseData: [
    {
      fullCallNumber: 'Aaa',
      shelfKey: 'Aa 1',
      isAnchor: true,
      totalRecords: 0,
    },
    {
      fullCallNumber: 'A 1958 A 8050',
      shelfKey: '41958 A 48050',
      totalRecords: 1,
      instance,
    },
    {
      fullCallNumber: 'ABBA',
      shelfKey: '41918 A 64243',
      totalRecords: 2,
      instance,
    },
  ],
  isEmptyMessage: 'Empty Message',
  isLoading: false,
  pagination: {
    hasNextPage: false,
    hasPrevPage: false,
    onNeedMoreData: jest.fn(),
  },
  totalRecords: 1,
};

const renderBrowseResultsList = (props = {}) => renderWithIntl(
  <BrowseResultsList
    {...defaultProps}
    {...props}
  />,
  translationsProperties,
);

const mockHistory = {
  push: jest.fn(),
};

describe('BrowseResultsList', () => {
  beforeEach(() => {
    mockHistory.push.mockClear();
    useHistory.mockClear().mockReturnValue(mockHistory);
  });

  it('should render browse data', () => {
    renderBrowseResultsList();

    expect(screen.getByText(defaultProps.browseData[1].fullCallNumber)).toBeInTheDocument();
  });

  it('should navigate to instance Search page and show related instances', async () => {
    renderBrowseResultsList();

    await act(async () => userEvent.click(screen.getByText(defaultProps.browseData[2].fullCallNumber)));

    expect(mockHistory.push).toHaveBeenCalled();
  });
});
