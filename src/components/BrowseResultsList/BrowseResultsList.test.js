import '../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import flow from 'lodash/flow';
import queryString from 'query-string';
import { act, cleanup, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { instance } from '../../../test/fixtures/instance';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import {
  browseModeOptions,
  BROWSE_INVENTORY_ROUTE,
  INVENTORY_ROUTE,
} from '../../constants';
import { DataContext } from '../../contexts';
import BrowseResultsList from './BrowseResultsList';
import { getSearchParams } from './utils';

const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;
let history = createMemoryHistory({
  initialEntries: [{
    pathname: BROWSE_INVENTORY_ROUTE,
    search: 'qindex=callNumbers&query=A',
  }],
});

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
    pageConfig: [0, null, null],
  },
  totalRecords: 1,
};

const mockContext = {
  contributorNameTypes: [{
    id: '2b94c631-fca9-4892-a730-03ee529ffe2a',
  }],
};

const renderBrowseResultsList = (props = {}) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={mockContext}>
      <BrowseResultsList
        {...defaultProps}
        {...props}
      />
    </DataContext.Provider>
  </Router>,
  translationsProperties,
);

describe('BrowseResultsList', () => {
  it('should render browse data', () => {
    renderBrowseResultsList();

    expect(screen.getByText(defaultProps.browseData[1].fullCallNumber)).toBeInTheDocument();
  });

  it('should navigate to instance Search page and show related instances', async () => {
    renderBrowseResultsList();

    await act(async () => userEvent.click(screen.getByText(defaultProps.browseData[2].fullCallNumber)));

    const { pathname, search } = history.location;

    expect(pathname).toEqual(INVENTORY_ROUTE);
    expect(search).toEqual(
      flow(
        getSearchParams,
        queryString.stringify,
        expect.stringContaining
      )(defaultProps.browseData[2], browseModeOptions.CALL_NUMBERS)
    );
  });

  describe('when Instance record is linked to an authority record', () => {
    describe('by clicking on the icon of an authority app', () => {
      const record = {
        contributorNameTypeId: '2b94c631-fca9-4892-a730-03ee529ffe2a',
        isAnchor: false,
        name: 'McOrmond, Steven Craig (Test) 1971-',
        totalRecords: 1,
      };
      const authorityId = 'bb30e977-f934-4a2f-8fb8-858bac51b7ab';
      const linkedRecord = {
        ...record,
        authorityId,
      };

      beforeEach(() => {
        cleanup();
        history = createMemoryHistory({
          initialEntries: [{
            pathname: BROWSE_INVENTORY_ROUTE,
            search: 'qindex=contributors&query=A',
          }],
        });

        renderBrowseResultsList({
          browseData: [linkedRecord],
        });

        userEvent.click(screen.getByTestId('authority-app-link'));
      });

      it('should open the authority record in a new tab', () => {
        expect(mockWindowOpen).toHaveBeenCalledWith(
          `/marc-authorities/authorities/${authorityId}?segment=search`,
          '_blank',
          'noopener,noreferrer'
        );
      });
    });
  });
});
