import React from 'react';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
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
}));

const renderRemoteStorageWarning = (props) => {
  const component = () => {
    return (
      <RemoteStorageWarning {...props} />
    );
  };
  renderWithIntl(
    <Form
      id="form-id"
      onSubmit={jest.fn()}
      render={component}
    />,
    translationsProperties
  );
};

describe('RemoteStorageWarning', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Component should render properly', () => {
    renderRemoteStorageWarning(defaultProps);
    expect(screen.getByText(/To remove the holdings from remote storage, run an exception report or communicate this directly to your remote storage location. This includes/i)).toBeInTheDocument();
    expect(screen.getByText(1)).toBeInTheDocument();
    expect(screen.getByText(/title./i)).toBeInTheDocument();
  });
});
