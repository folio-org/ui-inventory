import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import ModalContent from './ModalContent';
import { renderWithIntl } from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

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
  const onCancelMock = jest.fn();
  const onConfirmMock = jest.fn();
  const requestsUrl = '/requests';
  const itemRequestCount = 2;
  const status = 'Available';

  const renderModalContent = () => renderWithIntl(
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
  it('renders modal content', () => {
    const { getByText } = renderModalContent();

    expect(getByText(/confirmModal.message/)).toBeInTheDocument();
    expect(getByText(/confirmModal.requestMessage/)).toBeInTheDocument();
  });

  it('should render modal and call cancel on click', () => {
    const { getByRole } = renderModalContent();

    const cancelButton = getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('should render modal and call confirm on click', () => {
    const { getByRole } = renderModalContent();

    const confirmButton = getByRole('button', { name: /confirm/i });

    fireEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
