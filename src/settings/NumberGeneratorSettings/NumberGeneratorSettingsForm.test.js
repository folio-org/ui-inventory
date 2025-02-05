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

describe('NumberGeneratorSettingsForm', () => {
  it('should render the component with initial values', () => {
    renderComponent();

    expect(screen.getByText('Number generator options')).toBeInTheDocument();
    expect(screen.getByText('Fields which are usually filled using a numeric sequence can use the number generator. When the generator is switched on the field can either be fixed to prevent manual update, or made fully editable. When switched off, the field must be filled manually.')).toBeInTheDocument();

    expect(screen.getAllByText('Number generator off: The call number can be filled manually only.')).toHaveLength(2);
    expect(screen.getAllByText('Number generator on, editable: The call number can be filled using the generator and be edited, or filled manually.')).toHaveLength(2);
    expect(screen.getAllByText('Number generator on, fixed: The call number can be filled using the generator only.')).toHaveLength(2);

    expect(screen.getByText('Number generator off: The barcode can be filled manually only.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, editable: The barcode can be filled using the generator and be edited, or filled manually.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, fixed: The barcode can be filled using the generator only.')).toBeInTheDocument();

    expect(screen.getByText('Number generator off: The accession number can be filled manually only.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, editable: The accession number can be filled using the generator and be edited, or filled manually.')).toBeInTheDocument();
    expect(screen.getByText('Number generator on, fixed: The accession number can be filled using the generator only.')).toBeInTheDocument();

    expect(screen.getByText('Use the same generated number for accession number and call number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });

  it('should disable useSharedNumber-checkbox and show warning if clicking callNumber or accessionNumber to use manually', async () => {
    renderComponent();

    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const callNumberUseBoth = document.getElementById('callNumberUseBoth');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    expect(callNumberUseManually).toBeInTheDocument();
    expect(callNumberUseBoth).toBeInTheDocument();
    expect(accessionNumberUseManually).toBeInTheDocument();
    expect(useSharedNumberCheckbox).toBeInTheDocument();

    await userEvent.click(callNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');

    await userEvent.click(callNumberUseBoth);
    expect(useSharedNumberCheckbox).not.toHaveAttribute('disabled');

    await userEvent.click(accessionNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');
    expect(screen.getByText('Warning: The checkbox has been disabled because the accession number and/or the call number have been set to manual completion.')).toBeInTheDocument();
  });

  it('should disable callNumber or accessionNumber to use manually if clicking useSharedNumber-checkbox', async () => {
    renderComponent();

    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    expect(callNumberUseManually).toBeInTheDocument();
    expect(accessionNumberUseManually).toBeInTheDocument();
    expect(useSharedNumberCheckbox).toBeInTheDocument();

    await userEvent.click(useSharedNumberCheckbox);
    expect(callNumberUseManually).toHaveAttribute('disabled');
    expect(accessionNumberUseManually).toHaveAttribute('disabled');
  });
});
