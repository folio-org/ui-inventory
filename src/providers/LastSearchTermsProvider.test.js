import { render } from '@folio/jest-config-stripes/testing-library/react';
import '../../test/jest/__mock__';
import LastSearchTermsProvider from './LastSearchTermsProvider';
import { LastSearchTermsContext } from '../contexts';
import { getItem, setItem } from '../storage';
import { useLogout } from '../hooks';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useLogout: jest.fn(),
}));

jest.mock('../storage');

const customRender = (children) => {
  return render(
    <LastSearchTermsProvider>
      {children}
    </LastSearchTermsProvider>,
  );
};

describe('LastSearchTermsProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass correct props', () => {
    const { getByTestId } = customRender(
      <LastSearchTermsContext.Consumer>
        {({
          getLastSearch,
          getLastBrowse,
          getLastSegment,
          getLastSearchOffset,
          getLastBrowseOffset,
          storeLastSearch,
          storeLastBrowse,
          storeLastSegment,
          storeLastSearchOffset,
          storeLastBrowseOffset,
        }) => (
          <div>
            <div data-testid="initialSearch">{getLastSearch()}</div>
            <div data-testid="initialBrowse">{getLastBrowse()}</div>
            <div data-testid="initialSegment">{getLastSegment()}</div>
            <div data-testid="initialSearchOffset">{getLastSearchOffset('instances')}</div>
            <div data-testid="initialBrowseOffset">{JSON.stringify(getLastBrowseOffset())}</div>
            {storeLastSearch('fakeSearch', 'instances')}
            {storeLastBrowse('fakeBrowse')}
            {storeLastSearchOffset('fakeSearchOffset', 'instances')}
            {storeLastBrowseOffset('fakeBrowseOffset')}
            {storeLastSegment('instances')}
          </div>
        )}
      </LastSearchTermsContext.Consumer>
    );

    expect(getItem).toHaveBeenNthCalledWith(1, '@folio/inventory/search.lastSegment');
    expect(getItem).toHaveBeenNthCalledWith(2, '@folio/inventory/search.instances.lastSearch');
    expect(getItem).toHaveBeenNthCalledWith(3, '@folio/inventory/browse.lastSearch');
    expect(getItem).toHaveBeenNthCalledWith(4, '@folio/inventory/search.lastSegment');
    expect(getItem).toHaveBeenNthCalledWith(5, '@folio/inventory/search.instances.lastOffset');
    expect(getItem).toHaveBeenNthCalledWith(6, '@folio/inventory/browse.lastOffset');

    expect(setItem).toHaveBeenNthCalledWith(1, '@folio/inventory/search.instances.lastSearch', 'fakeSearch');
    expect(setItem).toHaveBeenNthCalledWith(2, '@folio/inventory/browse.lastSearch', 'fakeBrowse');
    expect(setItem).toHaveBeenNthCalledWith(3, '@folio/inventory/search.instances.lastOffset', 'fakeSearchOffset');
    expect(setItem).toHaveBeenNthCalledWith(4, '@folio/inventory/browse.lastOffset', 'fakeBrowseOffset');

    expect(getByTestId('initialSearch')).toHaveTextContent('');
    expect(getByTestId('initialBrowse')).toHaveTextContent('');
    expect(getByTestId('initialSearchOffset')).toHaveTextContent('0');
    expect(getByTestId('initialBrowseOffset')).toHaveTextContent('[0,null,null]');
  });

  describe('when the user logs out', () => {
    it('should reset data in session storage', () => {
      useLogout.mockImplementation(cb => cb());
      customRender();

      expect(setItem).toHaveBeenNthCalledWith(1, '@folio/inventory/search.lastSearch', null);
      expect(setItem).toHaveBeenNthCalledWith(2, '@folio/inventory/browse.lastSearch', null);
      expect(setItem).toHaveBeenNthCalledWith(3, '@folio/inventory/search.lastOffset', null);
      expect(setItem).toHaveBeenNthCalledWith(4, '@folio/inventory/browse.lastOffset', null);

      useLogout.mockRestore();
    });
  });
});
