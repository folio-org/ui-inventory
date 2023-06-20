import '../../../test/jest/__mock__';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseResultsPane from './BrowseResultsPane';

jest.mock('../BrowseResultsList', () => 'BrowseResultsList');

const defaultProps = {
  browseData: [],
  filters: {},
  isFiltersOpened: true,
  toggleFiltersPane: jest.fn(),
  pagination : {
    hasNextPage: false,
    hasPrevPage: false,
    onNeedMoreData: jest.fn(),
  },
  totalRecords: 0,
};

const renderBrowseResultsPane = (props = {}) => renderWithIntl(
  <BrowseResultsPane
    {...defaultProps}
    {...props}
  />,
  translationsProperties,
);

describe('BrowseResultsPane', () => {
  it('should render browse results pane', () => {
    renderBrowseResultsPane();

    expect(screen.getByTestId('browse-results-pane')).toBeInTheDocument();
  });
});
