import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '../../../test/jest/helpers';

import HRIDHandlingSettings from './HRIDHandlingSettings';

describe('HRIDHandlingSettings component', () => {
  const mutator = {
    hridSettings: {
      PUT: jest.fn(() => Promise.resolve()),
    },
  };
  const resources = {
    hridSettings: {
      records: [
        {
          id: '1',
          commonRetainLeadingZeroes: true,
          itemRetainLeadingZeroes: false,
          instanceRetainLeadingZeroes: true,
          holdingsRetainLeadingZeroes: false,
          authorityRetainLeadingZeroes: true,
          instance: {
            prefix: 'INST',
            startNumber: 1,
          },
        },
      ],
    },
  };

  beforeEach(() => {
    mutator.hridSettings.PUT.mockClear();
    renderWithIntl(
      <MemoryRouter>
        <HRIDHandlingSettings
          mutator={mutator}
          resources={resources}
        />
      </MemoryRouter>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders checkbox for removing leading zeroes', () => {
    const checkBox = screen.getByRole('checkbox', { id: 'checkbox-3' });
    userEvent.click(checkBox);
    expect(checkBox).toBeChecked();
    const ConfirmationButton = screen.getByRole('button', { name: /confirm/i });
    expect(ConfirmationButton).toBeInTheDocument();
    userEvent.click(ConfirmationButton);
  });

  it('Cancellation Button', () => {
    const CancellationButton = screen.getByRole('button', { name: 'cancel' });
    expect(CancellationButton).toBeInTheDocument();
    userEvent.click(CancellationButton);
  });
  it('allows the user to input values for "startWith" and "assignPrefix" fields', () => {
    const startWithFields = [
      screen.getByLabelText(/ui-inventory.hridHandling.label.startWith */i, { selector: 'input[name="instances.startNumber"]' }),
      screen.getByLabelText(/ui-inventory.hridHandling.label.startWith */i, { selector: 'input[name="holdings.startNumber"]' }),
      screen.getByLabelText(/ui-inventory.hridHandling.label.startWith */i, { selector: 'input[name="items.startNumber"]' }),
    ];
    const assignPrefixFields = [
      screen.getByLabelText(/ui-inventory.hridHandling.label.assignPrefix/i, { selector: 'input[name="instances.prefix"]' }),
      screen.getByLabelText(/ui-inventory.hridHandling.label.assignPrefix/i, { selector: 'input[name="holdings.prefix"]' }),
      screen.getByLabelText(/ui-inventory.hridHandling.label.assignPrefix/i, { selector: 'input[name="items.prefix"]' }),
    ];
    const testValues = ['100', 'prefix-', '200', 'prefix2-', '300', 'prefix3-'];
    startWithFields.forEach((field, index) => userEvent.type(field, testValues[index * 2]));
    assignPrefixFields.forEach((field, index) => userEvent.type(field, testValues[index * 2 + 1]));
    startWithFields.forEach((field, index) => expect(field.value).toBe(testValues[index * 2]));
    assignPrefixFields.forEach((field, index) => expect(field.value).toBe(testValues[index * 2 + 1]));
    const saveAndCloseButton = screen.getByRole('button', { name: /stripes-components.saveAndClose/i });
    userEvent.click(saveAndCloseButton);
    const ConfirmationButton = screen.getByRole('button', { name: /confirm/i });
    userEvent.click(ConfirmationButton);
    expect(mutator.hridSettings.PUT).toHaveBeenCalled();
  });
});

describe('HRIDHandlingSettings - commonRetainLeadingZeroes', () => {
  const initialSettings = {
    commonRetainLeadingZeroes: false,
    locations: {
      startNumber: '00000000001',
    },
    holdings: {
      startNumber: '00000000002',
    },
  };
  it('rendedr commonRetainLeadingZeroes', () => {
    renderWithIntl(
      <MemoryRouter>
        <HRIDHandlingSettings
          mutator={{ hridSettings: { PUT: jest.fn() } }}
          resources={{ hridSettings: { records: [initialSettings] } }}
        />
      </MemoryRouter>
    );
    const checkBox = screen.getByRole('checkbox', { id: 'checkbox-3' });
    expect(checkBox).toBeChecked();
  });
});
