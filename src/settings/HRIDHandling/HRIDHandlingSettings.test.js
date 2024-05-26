import {
  screen,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';
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

const renderComponent = (resources = initialResources, mutator = mockMutator) => {
  return renderWithIntl(renderWithRouter(
    <HRIDHandlingSettings resources={resources} mutator={mutator} />
  ));
};

describe('HRIDHandlingSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText(/ViewMetaData/)).toBeInTheDocument();
  });

  it('shows confirmation modal on form submission', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('confirm'));

    await waitFor(() => expect(mockMutator.hridSettings.PUT).toHaveBeenCalled());
  });

  it('validates required fields', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name:'cancel' }));

    await waitFor(() => expect(mockMutator.hridSettings.PUT).not.toHaveBeenCalled());
  });

  it('calls mutator on confirmation', async () => {
    renderComponent();
    const prefixInputs = screen.getAllByRole('textbox', { name: /hridHandling.label.startWith/ });

    fireEvent.click(screen.getByRole('checkbox'));

    prefixInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: 'new value' } });
    });

    fireEvent.click(screen.getByText(/saveAndClose/));

    prefixInputs.forEach((input) => {
      expect(input).toHaveValue('new value');
    });
  });
});
