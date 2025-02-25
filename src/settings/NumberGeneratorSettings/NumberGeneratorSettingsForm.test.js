import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

const onSubmitMock = jest.fn();

const renderComponent = () => renderWithIntl(
  <MemoryRouter>
    <NumberGeneratorSettingsForm
      onSubmit={(values) => onSubmitMock(values)}
    />
  </MemoryRouter>,
  translationsProperties
);

beforeEach(() => {
  renderComponent();
});

describe('Rendering NumberGeneratorSettingsForm', () => {
  it('should show headline and info text', () => {
    expect(screen.getByText('Number generator options')).toBeInTheDocument();
    expect(screen.getByText('Fields which are usually filled using a numeric sequence can use the number generator. When the generator is switched on the field can either be fixed to prevent manual update, or made fully editable. When switched off, the field must be filled manually.')).toBeInTheDocument();
  });

  it('should show accordions for "holdings" and "items"', () => {
    expect(screen.getByRole('region', { name: 'Holdings' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Items' })).toBeInTheDocument();
  });

  it('should show all input form fields in "holdings" accordion', () => {
    const holdingsAccordion = screen.getByRole('region', { name: 'Holdings' });
    expect(within(holdingsAccordion).getByRole('combobox', { name: 'Call number' })).toBeInTheDocument();
  });

  it('should show all input form fields in "items" accordion', () => {
    const itemsAccordion = screen.getByRole('region', { name: 'Items' });
    expect(within(itemsAccordion).getByRole('combobox', { name: 'Barcode' })).toBeInTheDocument();
    expect(within(itemsAccordion).getByRole('combobox', { name: 'Accession number' })).toBeInTheDocument();
    expect(within(itemsAccordion).getByRole('combobox', { name: 'Call number' })).toBeInTheDocument();
  });

  it('should show checkbox for using the same number', () => {
    expect(screen.getByText('Use the same generated number for accession number and call number')).toBeInTheDocument();
  });

  it('should show save and collaps all buttons', () => {
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });
});

describe('Clicking `off` option of accessionNumber', () => {
  it('should disable useSharedNumber-checkbox and show warning', async () => {
    const useEqualNumberCheckbox = screen.getByRole('checkbox', { name: 'Use the same generated number for accession number and call number' });
    const itemsAccordion = screen.getByRole('region', { name: 'Items' });
    const accessionNumberSelect = within(itemsAccordion).getByRole('combobox', { name: 'Accession number' });

    expect(accessionNumberSelect).toBeInTheDocument();
    expect(useEqualNumberCheckbox).toBeEnabled();

    await userEvent.selectOptions(accessionNumberSelect, ['off']);

    expect(useEqualNumberCheckbox).toBeDisabled();
    expect(screen.getByText('Warning: The checkbox has been disabled because the accession number and/or the call number have been set to manual completion.')).toBeInTheDocument();
  });
});

describe('Clicking useSharedNumber-checkbox', () => {
  it('should disable `off` option of callNumber and accessionNumber', async () => {
    const itemsAccordion = screen.getByRole('region', { name: 'Items' });
    expect(within(itemsAccordion).getByRole('combobox', { name: 'Accession number' })).toBeInTheDocument();
    expect(within(itemsAccordion).getByRole('combobox', { name: 'Call number' })).toBeInTheDocument();
    const accessionNumberSelect = within(itemsAccordion).getByRole('combobox', { name: 'Accession number' });
    const accessionNumberSelectOff = within(accessionNumberSelect).getByRole('option', { name: 'Off' });
    const callNumberSelect = within(itemsAccordion).getByRole('combobox', { name: 'Call number' });
    const callNumberSelectOff = within(callNumberSelect).getByRole('option', { name: 'Off' });

    expect(accessionNumberSelectOff).toBeEnabled();
    expect(callNumberSelectOff).toBeEnabled();

    const useEqualNumberCheckbox = screen.getByRole('checkbox', { name: 'Use the same generated number for accession number and call number' });

    await userEvent.click(useEqualNumberCheckbox);
    expect(accessionNumberSelectOff).toBeDisabled();
    expect(callNumberSelectOff).toBeDisabled();
  });
});
