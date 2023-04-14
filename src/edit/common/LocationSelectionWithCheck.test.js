import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';

import LocationSelectionWithCheck from './LocationSelectionWithCheck';

jest.mock('../../RemoteStorageService', () => ({
  Check: {
    useByLocation: () => jest.fn(),
  },
  Confirmation: {
    Heading: () => <div data-testid="RemoteStorageConfirmationHeading" />,
    Message: () => <div data-testid="RemoteStorageConfirmationMessage" />,
  },
}));


const queryClient = new QueryClient();

const input = {
  name: 'location',
  value: '123',
  onChange: jest.fn(),
};
const meta = {
  initial: '2'
};

const defaultProps = {
  input,
  meta
};

const renderLocationSelectionWithCheck = () => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <LocationSelectionWithCheck {...defaultProps} />
  </QueryClientProvider>,
  translationsProperties
);

describe('LocationSelectionWithCheck', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render select button', () => {
    renderLocationSelectionWithCheck();
    const selectBtn = screen.getByTestId('LocationSelectionSelectBtn');
    expect(selectBtn).toBeInTheDocument();
    expect(selectBtn).toHaveTextContent('Select');
  });
  it('should display location lookup when select button is clicked', () => {
    renderLocationSelectionWithCheck();
    const selectBtn = screen.getByTestId('LocationSelectionSelectBtn');
    userEvent.click(selectBtn);
    const locationLookup = screen.getByText('LocationLookup');
    expect(locationLookup).toBeInTheDocument();
    expect(screen.getByText('Inactive location')).toBeInTheDocument();
    expect(screen.getByText('This location has a status of inactive. Are you sure you want to select this location?')).toBeInTheDocument();
  });
  it('should display confirmation modal when confirm button is clicked', () => {
    renderLocationSelectionWithCheck();
    const selectBtn = screen.getByTestId('LocationSelectionSelectBtn');
    userEvent.click(selectBtn);
    const confirmBtn = screen.getByTestId('ConfirmationModalConfirmBtn');
    userEvent.click(confirmBtn);
    const confirmationModalHeading = screen.getByTestId('ConfirmationModalHeading');
    const confirmationModalMessage = screen.getByTestId('ConfirmationModalMessage');
    const cancelBtn = screen.getByTestId('ConfirmationModalCancelBtn');
    expect(confirmationModalHeading).toBeInTheDocument();
    expect(confirmationModalMessage).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });
  it('should close confirmation modal when cancel button is clicked', () => {
    renderLocationSelectionWithCheck();
    const selectBtn = screen.getByTestId('LocationSelectionSelectBtn');
    userEvent.click(selectBtn);
    const confirmBtn = screen.getByTestId('ConfirmationModalConfirmBtn');
    userEvent.click(confirmBtn);
    const cancelBtn = screen.getByTestId('ConfirmationModalCancelBtn');
    userEvent.click(cancelBtn);
    const confirmationModalHeading = screen.queryByTestId('ConfirmationModalHeading');
    const confirmationModalMessage = screen.queryByTestId('ConfirmationModalMessage');
    const cancelBtnAgain = screen.queryByTestId('ConfirmationModalCancelBtn');
    expect(confirmationModalHeading).toBeInTheDocument();
    expect(confirmationModalMessage).toBeInTheDocument();
    expect(cancelBtnAgain).toBeInTheDocument();
  });
});
