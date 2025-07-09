
import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import { renderWithRouter, renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';
import AdditionalCallNumbersFields from '../AdditionalCallNumbersItemLevelFields';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();

const callNumberTypeOptions = [
  { label: 'Library of Congress', value: '1' },
  { label: 'Dewey', value: '2' },
];

const defaultProps = {
  callNumberTypeOptions,
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

const WrappedForm = ({
  onSubmit: submitHandler,
  initialValues,
  ...props
}) => (
  <Form
    onSubmit={submitHandler}
    initialValues={initialValues}
    mutators={{
      ...arrayMutators
    }}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <AdditionalCallNumbersFields {...props} />
      </form>
    )}
  />
);

const renderAdditionalCallNumbersFields = (props = {}) => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} {...defaultProps} {...props} />),
  translationsProperties
);

describe('AdditionalCallNumbersFields', () => {
  it('should render empty additional call numbers section', () => {
    renderAdditionalCallNumbersFields();
    expect(screen.getByText('Additional call numbers')).toBeInTheDocument();
    expect(screen.getByText('Add additional call number')).toBeInTheDocument();
  });

  it('should render fields with initial values', () => {
    const initialValues = {
      additionalCallNumbers: [{
        typeId: '1',
        prefix: 'Prefix1',
        callNumber: 'CN1',
        suffix: 'Suffix1'
      }]
    };

    renderAdditionalCallNumbersFields({ initialValues });
    expect(screen.getByText('Additional call numbers')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Library of Congress' }).selected).toBe(true);
    expect(screen.getByText('Prefix1')).toBeInTheDocument();
    expect(screen.getByText('CN1')).toBeInTheDocument();
    expect(screen.getByText('Suffix1')).toBeInTheDocument();
  });

  it('should add new call number fields when clicking add button', () => {
    renderAdditionalCallNumbersFields();
    expect(screen.getByText('Add additional call number')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Call number')).not.toBeInTheDocument();
    expect(screen.queryByText('Call number prefix')).not.toBeInTheDocument();
    expect(screen.queryByText('Call number suffix')).not.toBeInTheDocument();
    expect(screen.queryByText('Library of Congress')).not.toBeInTheDocument();

    const addButton = screen.getByText('Add additional call number');
    fireEvent.click(addButton);
    expect(screen.getByLabelText('Call number type')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number prefix')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number suffix')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Library of Congress' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Dewey' }).selected).toBe(false);
  });

  it('should delete call number fields when clicking delete button', () => {
    const initialValues = {
      additionalCallNumbers: [{
        typeId: '2',
        prefix: 'Prefix1',
        callNumber: 'CN1',
        suffix: 'Suffix1'
      }]
    };

    renderAdditionalCallNumbersFields({ initialValues });

    expect(screen.getByRole('button', { name: 'Delete this item' })).toBeInTheDocument();
    expect(screen.getByText('Prefix1')).toBeInTheDocument();
    expect(screen.getByText('CN1')).toBeInTheDocument();
    expect(screen.getByText('Suffix1')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dewey' }).selected).toBe(true);

    const deleteButton = screen.getByRole('button', { name: 'Delete this item' });
    fireEvent.click(deleteButton);

    expect(screen.queryByDisplayValue('Prefix1')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('CN1')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Suffix1')).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Dewey' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete this item' })).toBeNull();
  });

  it('should disable fields when canEdit is false', () => {
    renderAdditionalCallNumbersFields({
      canEdit: false,
      initialValues: {
        additionalCallNumbers: [{
          typeId: '1',
          prefix: 'Prefix1',
          callNumber: 'CN1',
          suffix: 'Suffix1'
        }]
      }
    });

    expect(screen.getByLabelText('Call number type')).toBeDisabled();
    expect(screen.getByLabelText('Call number prefix')).toBeDisabled();
    expect(screen.getByLabelText('Call number')).toBeDisabled();
    expect(screen.getByLabelText('Call number suffix')).toBeDisabled();
  });

  it('should hide add button when canAdd is false', () => {
    renderAdditionalCallNumbersFields({ canAdd: false });
    expect(screen.queryByText('Add additional call number')).not.toBeInTheDocument();
  });

  it('should hide delete button when canDelete is false', () => {
    renderAdditionalCallNumbersFields({
      canDelete: false,
      initialValues: {
        additionalCallNumbers: [{
          typeId: '1',
          callNumber: 'CN1',
        }]
      }
    });
    expect(screen.queryByRole('button', { name: 'Delete this item' })).toBeDisabled();
  });

  it('should render swap button for each additional call number', () => {
    renderAdditionalCallNumbersFields({
      initialValues: {
        additionalCallNumbers: [{
          typeId: '1',
          prefix: 'Prefix1',
          callNumber: 'CN1',
          suffix: 'Suffix1'
        }]
      }
    });
    expect(screen.getByText('CN1')).toBeInTheDocument();
    expect(screen.getByText('Prefix1')).toBeInTheDocument();
    expect(screen.getByText('Suffix1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change with primary call number/i })).toBeInTheDocument();
  });
});
