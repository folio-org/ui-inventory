import React from 'react';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import { cleanup } from '@testing-library/react-hooks';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { RemoteStorageWarning } from './RemoteStorageWarning';

const defaultProps = {
  itemCount: 1,
};

const initialValues = {
  permanentLocationId: 'holdings-id-1',
  temporaryLocationId: 'holdings-id-2',
};

const values = {
  permanentLocationId: 'holdings-id-3',
  temporaryLocationId: 'holdings-id-4'
};

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormState: jest.fn().mockReturnValue({
    initialValues,
    values
  })
    .mockReturnValueOnce({
      initialValues,
      values: {
        permanentLocationId: 'holdings-id-1',
        temporaryLocationId: 'holdings-id-2',
      }
    })
}));

const component = () => {
  return (
    <RemoteStorageWarning {...defaultProps} />
  );
};

const renderRemoteStorageWarning = () => renderWithIntl(
  <Form
    id="form-id"
    onSubmit={jest.fn()}
    render={component}
  />,
  translationsProperties
);

describe('RemoteStorageWarning', () => {
  beforeEach(() => {
    cleanup();
  });
  it('DOM to be empty when values are unchanged', () => {
    renderRemoteStorageWarning(defaultProps);
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });
  it('Warning text should render when values change', () => {
    renderRemoteStorageWarning();
    expect(screen.getByText(/To remove the holdings from remote storage, run an exception report or communicate this directly to your remote storage location. This includes/i)).toBeInTheDocument();
    expect(screen.getByText(1)).toBeInTheDocument();
    expect(screen.getByText(/title./i)).toBeInTheDocument();
  });
});
