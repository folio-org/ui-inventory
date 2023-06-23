import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';


import BoundWithModal from './BoundWithModal';

const itemMock = {
  hrid: '12345',
  barcode: '67890',
};

const onOkMock = jest.fn();
const onCloseMock = jest.fn();

const renderBoundWithModal = () => renderWithIntl(
  <BoundWithModal
    item={itemMock}
    open
    onClose={onCloseMock}
    onOk={onOkMock}
  />,
  translationsProperties
);

describe('BoundWithModal', () => {
  beforeEach(() => {
    renderBoundWithModal();
  });

  it('renders without crashing', () => {
    expect(screen.getByTestId('bound-with-modal')).toBeInTheDocument();
  });

  it('displays item details', () => {
    expect(screen.getByText(itemMock.hrid)).toBeInTheDocument();
    expect(screen.getByText(itemMock.barcode)).toBeInTheDocument();
  });

  it('triggers onOk callback with input values when save button is clicked', () => {
    const inputs = screen.getAllByTestId('bound-with-modal-input');

    // fill inputs with values
    inputs.forEach((input, i) => {
      userEvent.type(input, `Value ${i}`);
    });

    userEvent.click(screen.getByTestId('bound-with-modal-save-button'));

    expect(onOkMock).toHaveBeenCalledWith(['Value 0', 'Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6']);
  });

  it('triggers onClose callback when cancel button is clicked', () => {
    userEvent.click(screen.getByTestId('bound-with-modal-cancel-button'));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
