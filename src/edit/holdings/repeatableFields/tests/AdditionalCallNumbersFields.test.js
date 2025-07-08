
import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import { renderWithRouter, renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';
import AdditionalCallNumbersFields from '../AdditionalCallNumbersFields';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();

const callNumberTypeOptions = [
  { label: 'Library of Congress', value: '1' },
  { label: 'Dewey', value: '2' },
];

const defaultProps = {
  callNumberTypeOptions,
  isFieldBlocked: () => false,
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
    expect(screen.getByText('Library of Congress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Prefix1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CN1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Suffix1')).toBeInTheDocument();
  });

  it('should add new call number fields when clicking add button', () => {
    renderAdditionalCallNumbersFields();
    expect(screen.getByText('Add additional call number')).toBeInTheDocument();
    const addButton = screen.getByText('Add additional call number');
    fireEvent.click(addButton);
    expect(screen.getByLabelText('Call number type')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number prefix')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number')).toBeInTheDocument();
    expect(screen.getByLabelText('Call number suffix')).toBeInTheDocument();
  });

  it('should delete call number fields when clicking delete button', () => {
    const initialValues = {
      additionalCallNumbers: [{
        typeId: '1',
        prefix: 'Prefix1',
        callNumber: 'CN1',
        suffix: 'Suffix1'
      }]
    };

    renderAdditionalCallNumbersFields({ initialValues });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByDisplayValue('Prefix1')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('CN1')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Suffix1')).not.toBeInTheDocument();
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

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should respect field blocking', () => {
    const isFieldBlocked = (fieldName) => fieldName === 'callNumber';

    renderAdditionalCallNumbersFields({
      isFieldBlocked,
      initialValues: {
        additionalCallNumbers: [{
          typeId: '1',
          callNumber: 'CN1',
        }]
      }
    });

    expect(screen.getByLabelText('Call number')).toBeDisabled();
    expect(screen.getByLabelText('Call number type')).not.toBeDisabled();
  });
});
