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

import AddItemButton from './AddItemButton';

const mockOnAddItem = jest.fn();

const renderAddItemButton = () => {
  const component = (
    <AddItemButton
      holding={{ id: 'holdingsId' }}
      tenantId="college"
      onAddItem={mockOnAddItem}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('AddItemButton', () => {
  it('should display Add item button', () => {
    renderAddItemButton();

    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  describe('when clicking Add item button', () => {
    it('should call onAddItem callback', async () => {
      renderAddItemButton();

      const addItem = screen.getByRole('button', { name: /add item/i });

      fireEvent.click(addItem);

      await waitFor(() => expect(mockOnAddItem).toHaveBeenCalled());
    });
  });
});
