import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';

import { order, orderLine, orderSetting, vendor, resultData } from './fixtures';
import ItemAcquisition from './ItemAcquisition';
import useItemAcquisition from './useItemAcquisition';

jest.mock('./useItemAcquisition', () => jest.fn());

const renderItemAcquisition = (props = {}) => (
  renderWithIntl(
    <Router>
      <ItemAcquisition
        accordionId="accordionId"
        {...props}
      />
    </Router>
  )
);

describe('ItemAcquisition', () => {
  beforeEach(() => {
    useItemAcquisition.mockClear().mockReturnValue({ itemAcquisition: resultData });
  });

  describe('when active tenant has acquisitions', () => {
    it('should render PO line as a link', () => {
      renderItemAcquisition({ itemId: 'itemId' });

      const link = screen.getByText(orderLine.poLineNumber);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/orders/lines/view/${orderLine.id}`);
    });
  });

  describe('when central tenant has acquisitions', () => {
    it('should render PO line as a plain text', () => {
      useItemAcquisition.mockClear().mockReturnValue({ itemAcquisition: resultData, isCentralTenantAcquisition: true });
      renderItemAcquisition({ itemId: 'itemId' });

      const poLineNumber = screen.getByText(orderLine.poLineNumber);

      expect(poLineNumber).toBeInTheDocument();
      expect(poLineNumber).not.toHaveAttribute('href', `/orders/lines/view/${orderLine.id}`);
    });
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

  it('should display fetched item acquisition data - vendor code with link', () => {
    renderItemAcquisition({ itemId: 'itemId' });
    const link = screen.getByRole('link', { name: 'AMAZ' });

    expect(screen.getByText(vendor.code)).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/organizations/view/vendorId');
  });

  it('should display fetched item acquisition data - vendor name with link', () => {
    renderItemAcquisition({ itemId: 'itemId' });
    const link = screen.getByRole('link', { name: 'Amazon' });

    expect(screen.getByText(vendor.name)).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/organizations/view/vendorId');
  });

  it('should display fetched item acquisition data - acquisition method', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText(orderSetting.value)).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - calculation and formatting of average cost', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    // sum(finance-amountExpended) / sum(orderLine-quantity)
    expect(screen.getByText('$3.26')).toBeInTheDocument();
  });

  it('should display fetched item acquisition data - all fund codes comma separated', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.getByText('ABC, XYZ')).toBeInTheDocument();
  });
});

describe('ItemAcquisition without data', () => {
  beforeEach(() => {
    useItemAcquisition.mockClear().mockReturnValue({ });
  });

  it('should display all noValueSet components', () => {
    renderItemAcquisition({ itemId: 'itemId' });

    expect(screen.queryAllByText('stripes-components.noValue.noValueSet').length).toBe(10);
  });
});
