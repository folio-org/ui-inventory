import '../../../test/jest/__mock__';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import MissedMatchItem from './MissedMatchItem';

const defaultProps = {
  query: 'ABC',
};

const renderMissedMatchItem = (props = {}) => renderWithIntl(
  <MissedMatchItem
    {...defaultProps}
    {...props}
  />,
  translationsProperties,
);

describe('MissedMatchItem', () => {
  it('should render missed match item', () => {
    renderMissedMatchItem();

    expect(screen.getByText(/.*would be here/)).toBeInTheDocument();
  });
});
