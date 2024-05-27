import {
  screen,
  fireEvent,
  waitFor,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';
import React from 'react';
import { renderWithIntl } from '../../../test/jest/helpers';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';

import HRIDHandlingSettings from './HRIDHandlingSettings';

const initialResources = {
  hridSettings: {
    records: [
      {
        commonRetainLeadingZeroes: true,
        instance: { startNumber: '00000000001', prefix: '' },
        holding: { startNumber: '00000000001', prefix: '' },
        item: { startNumber: '00000000001', prefix: '' },
      },
    ],
  },
};

const mockMutator = {
  hridSettings: {
    PUT: jest.fn(() => Promise.resolve()),
  },
};


const renderComponent = ({ resources = initialResources, mutator = mockMutator }) => {
  return (
    renderWithIntl(
      renderWithRouter(
        <HRIDHandlingSettings resources={resources} mutator={mutator} />
      )
    )
  );
};

describe('HRIDHandlingSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent({});
    expect(screen.getByText(/ViewMetaData/)).toBeInTheDocument();
  });

  it('should call PUT rejected on submit form', async () => {
    const mockMutatorRejected = {
      hridSettings: {
        PUT: jest.fn(() => Promise.reject()),
      },
    };

    renderComponent({ mutator: mockMutatorRejected });

    act(() => {
      fireEvent.click(screen.getByText('confirm'));
    });

    await waitFor(() => expect(mockMutatorRejected.hridSettings.PUT).toHaveBeenCalled());
  });

  it('should call PUT with resolve on submit form', async () => {
    renderComponent({});

    fireEvent.click(screen.getByText('confirm'));

    await waitFor(() => expect(mockMutator.hridSettings.PUT).toHaveBeenCalled());
  });

  it('should not call hridSettings.PUT on cancel', async () => {
    renderComponent({});

    fireEvent.click(screen.getByRole('button', { name:'cancel' }));

    await waitFor(() => expect(mockMutator.hridSettings.PUT).not.toHaveBeenCalled());
  });

  it('should update value in inputs correctly', async () => {
    renderComponent({});
    const prefixInputs = screen.getAllByRole('textbox', { name: /hridHandling.label.startWith/ });

    fireEvent.click(screen.getByRole('checkbox'));

    prefixInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: 'new value' } });
    });

    fireEvent.click(screen.getByText('confirm'));

    act(() => {
      fireEvent.click(screen.getByText(/saveAndClose/));
    });

    prefixInputs.forEach((input) => {
      expect(input).toHaveValue('new value');
    });

    fireEvent.click(screen.getByText(/saveAndClose/));
  });

  it('should update values correctly commonRetainLeadingZeroes false', async () => {
    const mockResources = {
      hridSettings: {
        records: [
          {
            commonRetainLeadingZeroes: false,
            instance: { startNumber: '00000000001', prefix: '' },
            holding: { startNumber: '00000000001', prefix: '' },
            item: { startNumber: '00000000001', prefix: '' },
          },
        ],
      },
    };
    renderComponent({ resources: mockResources });

    const prefixInputs = screen.getAllByRole('textbox', { name: /hridHandling.label.startWith/ });
    const assignPrefix = screen.getAllByRole('textbox', { name: /label.assignPrefix/ });

    fireEvent.click(screen.getByRole('checkbox'));

    prefixInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: 'new value' } });
    });

    assignPrefix.forEach((input) => {
      fireEvent.change(input, { target: { value: 'new prefix' } });
    });

    assignPrefix.forEach((input) => {
      expect(input).toHaveValue('new prefix');
    });

    fireEvent.click(screen.getByText(/saveAndClose/));

    act(() => {
      fireEvent.click(screen.getByText(/confirm/));
    });
  });
});
