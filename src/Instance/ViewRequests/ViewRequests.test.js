import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import ViewRequests from './ViewRequests';

const items = [
  {
    barcode: '1234',
    status: { name: 'available' },
    id: '1',
    holdingsRecordId: '2',
    materialType: { name: 'book' },
    temporaryLoanType: { name: 'temporary' },
    effectiveLocation: { name: 'Main Library' },
    enumeration: 'vol 1',
    chronology: '2001'
  },
];
const requestsMap = new Map([['1', '1']]);
const loansMap = new Map([['1', [{ id: '1', dueDate: '2023-03-31T20:00:00.000Z' }]]]);
const instanceId = '1';
const instance = { title: 'Book Title', publication: [{ dateOfPublication: '2022' }] };

const onCloseViewRequests = jest.fn();

const ViewRequestsSetup = () => (
  <Router>
    <ViewRequests
      instance={instance}
      instanceId={instanceId}
      items={items}
      loansMap={loansMap}
      onCloseViewRequests={onCloseViewRequests}
      requestsMap={requestsMap}
    />
  </Router>
);

describe('ViewRequests', () => {
  beforeEach(() => {
    renderWithIntl(<ViewRequestsSetup />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render paneTitles', () => {
    expect(screen.getByText(/ui-inventory.instanceRecordRequestsTitle/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.instanceRecordRequestsSubtitle/i)).toBeInTheDocument();
  });
  it('should render the correct column headers', () => {
    expect(screen.getByText(/ui-inventory.item.barcode/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.status/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.item.availability.dueDate/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.item.requestQueue/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.effectiveLocationShort/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.loanType/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.enumeration/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.chronology/i)).toBeInTheDocument();
    expect(screen.getByText(/ui-inventory.materialType/i)).toBeInTheDocument();
  });
  it('should render the correct data for each item', () => {
    expect(screen.getByText(/1234/i)).toBeInTheDocument();
    expect(screen.getByText(/available/i)).toBeInTheDocument();
    expect(screen.getByText('3/31/2023, 8:00 PM')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Main Library/i)).toBeInTheDocument();
    expect(screen.getByText(/temporary/i)).toBeInTheDocument();
    expect(screen.getByText(/vol 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2001/i)).toBeInTheDocument();
    expect(screen.getByText(/book/i)).toBeInTheDocument();
  });
  it('should click barcodeButton', () => {
    const barcodeButton = screen.getByRole('button', { name: 'ui-inventory.item.barcode' });
    userEvent.click(barcodeButton);
    expect(barcodeButton.getAttribute('aria-sort')).toEqual(null);
  });
  it('should click requestQueue', () => {
    const requestQueueButton = screen.getByRole('button', { name: 'ui-inventory.item.requestQueue' });
    userEvent.click(requestQueueButton);
    expect(requestQueueButton.getAttribute('aria-sort')).toEqual(null);
  });
});
