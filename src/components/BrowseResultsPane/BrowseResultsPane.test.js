import '../../../test/jest/__mock__';

import { screen } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseResultsPane from './BrowseResultsPane';

const defaultProps = {
  filters: {},
  isFiltersOpened: true,
  toggleFiltersPane: jest.fn(),
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
