import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemsCountBadge from './ItemsCountBadge';

const renderItemsCountBadge = () => {
  const component = <ItemsCountBadge itemCount={6} />;

  return renderWithIntl(component, translationsProperties);
};

describe('ItemsCountBadge', () => {
  it('should display badge with item count', () => {
    renderItemsCountBadge();

    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
