import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
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
      onSubmit={onSubmitMock}
    />
  </MemoryRouter>, translationsProperties
);

beforeEach(() => {
  renderComponent();
});

describe('Rendering NumberGeneratorSettingsForm', () => {
  it('should show headline and info text', () => {
    expect(screen.getByText('Number generator options')).toBeInTheDocument();
    expect(screen.getByText('Fields which are usually filled using a numeric sequence can use the number generator. When the generator is switched on the field can either be fixed to prevent manual update, or made fully editable. When switched off, the field must be filled manually.')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.numberGenerator.infoAdditional')).toBeInTheDocument();
  });

  it('should show all call number radio buttons', () => {
    expect(screen.getAllByText('Number generator off: The call number can be filled manually only.')).toHaveLength(2);
    expect(screen.getAllByText('Number generator on, editable: The call number can be filled using the generator and be edited, or filled manually.')).toHaveLength(2);
    expect(screen.getAllByText('Number generator on, fixed: The call number can be filled using the generator only.')).toHaveLength(2);
  });

  it('should show all barcode radio buttons', () => {
    expect(screen.getByText('Number generator off: The barcode can be filled manually only.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, editable: The barcode can be filled using the generator and be edited, or filled manually.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, fixed: The barcode can be filled using the generator only.')).toBeInTheDocument();
  });

  it('should show all accession number radio buttons', () => {
    expect(screen.getByText('Number generator off: The accession number can be filled manually only.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, editable: The accession number can be filled using the generator and be edited, or filled manually.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, fixed: The accession number can be filled using the generator only.')).toBeInTheDocument();
  });

  it('should show checkbox for using the same number', () => {
    expect(screen.getByText('Use the same generated number for accession number and call number')).toBeInTheDocument();
  });

  it('should show save and collaps all buttons', () => {
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });
});

describe('Clicking manually use of callNumber or accessionNumber', () => {
  it('should disable useSharedNumber-checkbox and show warning', async () => {
    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const callNumberUseBoth = document.getElementById('callNumberUseBoth');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    await userEvent.click(callNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');

    await userEvent.click(callNumberUseBoth);
    expect(useSharedNumberCheckbox).not.toHaveAttribute('disabled');

    await userEvent.click(accessionNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');
    expect(screen.getByText('Warning: The checkbox has been disabled because the accession number and/or the call number have been set to manual completion.')).toBeInTheDocument();
  });
});

describe('Clicking useSharedNumber-checkbox', () => {
  it('should disable manually use of callNumber and accessionNumber', async () => {
    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    await userEvent.click(useSharedNumberCheckbox);
    expect(callNumberUseManually).toHaveAttribute('disabled');
    expect(accessionNumberUseManually).toHaveAttribute('disabled');
  });
});
