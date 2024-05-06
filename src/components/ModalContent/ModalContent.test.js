import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModalContent from './ModalContent';
import { renderWithIntl } from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

const stripesMock = {
  hasPerm: jest.fn().mockReturnValue(true),
};

const itemMock = {
  title: 'Sample Title',
  barcode: '123456789',
  materialType: {
    name: 'Book',
  },
};

describe('ModalContent', () => {
  it('renders with correct props and messages', () => {
    const onCancelMock = jest.fn();
    const onConfirmMock = jest.fn();
    const requestsUrl = '/requests';
    const itemRequestCount = 2;
    const status = 'Available';

    const { getByText, getByRole } = renderWithIntl(
      <MemoryRouter>
        <ModalContent
          stripes={stripesMock}
          item={itemMock}
          status={status}
          requestsUrl={requestsUrl}
          onCancel={onCancelMock}
          onConfirm={onConfirmMock}
          itemRequestCount={itemRequestCount}
        />
      </MemoryRouter>
    );

    expect(getByText(/confirmModal.message/)).toBeInTheDocument();
    expect(getByText(/confirmModal.requestMessage/)).toBeInTheDocument();

    const cancelButton = getByRole('button', { name: /cancel/i });
    const confirmButton = getByRole('button', { name: /confirm/i });

    fireEvent.click(cancelButton);
    expect(onCancelMock).toHaveBeenCalledTimes(1);

    fireEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
