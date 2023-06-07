import '../../../test/jest/__mock__';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { LocationSelectionWithCheck } from './LocationSelectionWithCheck';

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
  it('component should render correctly', () => {
    const { getByText } = renderLocationSelectionWithCheck();
    expect(getByText('LocationLookup')).toBeInTheDocument();
    expect(getByText('ConfirmationModal')).toBeInTheDocument();
  });
  it('warning message should render on clicking select button', () => {
    const { container, getByRole, getByText } = renderLocationSelectionWithCheck();
    userEvent.click(getByRole('button', { name: 'Select' }));
    expect(getByRole('alert')).not.toBeEmptyDOMElement();
    expect(getByText('Inactive location')).toBeInTheDocument();
    expect(container.getElementsByClassName('inner type-warning').length).toBe(1);
  });
  it('Warning message should disapper after clicking confin button', () => {
    const { container, getByRole } = renderLocationSelectionWithCheck();
    userEvent.click(getByRole('button', { name: 'Select' }));
    userEvent.click(getByRole('button', { name: 'confirm' }));
    expect(container.getElementsByClassName('inner type-warning').length).toBe(0);
  });
  it('Warning message should disapper after clicking cancel button', () => {
    const { container, getByRole } = renderLocationSelectionWithCheck();
    userEvent.click(getByRole('button', { name: 'Select' }));
    userEvent.click(getByRole('button', { name: 'cancel' }));
    expect(container.getElementsByClassName('inner type-warning').length).toBe(0);
  });
});
