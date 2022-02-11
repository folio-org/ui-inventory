import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import { order, orderLine, vendor, resultData } from './fixtures';
import ItemAcquisition from './ItemAcquisition';
import useItemAcquisition from './useItemAcquisition';

jest.mock('./useItemAcquisition', () => jest.fn());

const renderItemAcquisition = ({
  itemId,
} = {}) => (
  renderWithIntl(
    <Router>
      <ItemAcquisition itemId={itemId} />
    </Router>
  )
);

describe('ItemAcquisition', () => {
  beforeEach(() => {
    useItemAcquisition.mockClear().mockReturnValue({ itemAcquisition: resultData });
  });

  it('should display fetched item acquisition data - PO line number', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(orderLine.poLineNumber)).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - order status', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(`ui-inventory.acq.orderStatus.${order.workflowStatus}`)).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - order type', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(`ui-inventory.acq.orderType.${order.orderType}`)).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - PO line receipt status', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(`ui-inventory.acq.receiptStatus.${orderLine.receiptStatus}`)).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - vendor code', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(vendor.code)).toBeInTheDocument();
  });
});
