import {
  fireEvent,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ViewHoldingsButton from './ViewHoldingsButton';

const mockOnViewHolding = jest.fn();

const renderViewHoldingsButton = () => {
  const component = (
    <ViewHoldingsButton
      holding={{ id: 'holdingsId' }}
      tenantId="college"
      onViewHolding={mockOnViewHolding}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewHoldingsButton', () => {
  it('should display View holdings button', () => {
    renderViewHoldingsButton();

    expect(screen.getByRole('button', { name: /view holdings/i })).toBeInTheDocument();
  });

  describe('when clicking View holdings button', () => {
    it('should call onViewHolding callback', async () => {
      renderViewHoldingsButton();

      const viewHoldings = screen.getByRole('button', { name: /view holdings/i });

      fireEvent.click(viewHoldings);

      await waitFor(() => expect(mockOnViewHolding).toHaveBeenCalled());
    });
  });
});
