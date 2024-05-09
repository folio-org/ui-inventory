import React from 'react';
import {
  screen,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/dom';
import { LocationSelectionWithCheck } from './LocationSelectionWithCheck';
import '../../../test/jest/__mock__';
import { renderWithFinalForm, renderWithIntl } from '../../../test/jest/helpers';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';

jest.mock('../../RemoteStorageService', () => ({
  Check: {
    useByLocation: jest.fn(() => jest.fn(() => true)), // Mocking always true for check
  },
  Confirmation: {
    Heading: jest.fn(() => 'Remote Storage Heading'),
    Message: jest.fn(() => 'Remote Storage Message'),
  },
}));

jest.mock('@folio/stripes/smart-components', () => ({ ...jest.requireActual('@folio/stripes/smart-components'),
  LocationSelection: (props) => {
    const { onSelect, resources } = props;
    return (<button type="button" data-testid="selection-id" onClick={() => onSelect(resources.locations.records)}>LocationSelection</button>);
  } }));

const inputMock = {
  value: 'test',
  onChange: jest.fn(),
};

const restMock = {
  meta: {
    initial: 1
  },
  resources: {
    'id': '2b51c2f5-6779-4913-9cc8-05508ea406a4',
    'isPrimary': false,
    'tenantId': 'diku',
    'tenantName': 'Snapshot',
    'userId': 'f2a0e0ce-cef9-51e5-979a-7cea9db21ecf',
    'username': 'diku_admin',
    locations: {
      records:
        {
          name: 'Test Location',
          id: '2',
          code: '1',
          isActive: true,
        }
    }
  },
};

describe('LocationSelectionWithCheck', () => {
  it('render with selected location and confirm changes', async () => {
    renderWithIntl(renderWithRouter(renderWithFinalForm(
      <LocationSelectionWithCheck name="location" input={inputMock} {...restMock} />
    )));

    const confirmButton = screen.getByRole('button', { name: 'confirm' });

    act(() => fireEvent.click(screen.getByTestId('selection-id')));

    fireEvent.click(confirmButton);
  });

  it('render with selected location and cancel changes', async () => {
    renderWithIntl(renderWithRouter(renderWithFinalForm(
      <LocationSelectionWithCheck name="location" input={inputMock} {...restMock} />
    )));

    const cancelButton = screen.getByRole('button', { name: 'cancel' });

    act(() => fireEvent.click(screen.getByTestId('selection-id')));

    fireEvent.click(cancelButton);
  });
});
