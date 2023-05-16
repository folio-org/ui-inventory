import React from 'react';
import { Form } from 'react-final-form';
import { cleanup } from '@folio/jest-config-stripes/testing-library/react-hooks';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { RemoteStorageWarning } from './RemoteStorageWarning';

const initialValues = {
  permanentLocation: { id: 'holdings-id-1' },
  temporaryLocation: { id: 'holdings-id-2' },
};

const values = {
  permanentLocation: { id: 'holdings-id-3' },
  temporaryLocation: { id: 'holdings-id-4' }
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
        permanentLocation: { id: 'holdings-id-1' },
        temporaryLocation: { id: 'holdings-id-2' },
      }
    })
}));

const component = () => {
  return (
    <RemoteStorageWarning />
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
    const { getByRole } = renderRemoteStorageWarning();
    expect(getByRole('alert')).toBeEmptyDOMElement();
  });
  it('Warning text should render when values change', () => {
    const { container } = renderRemoteStorageWarning();
    expect(container.getElementsByClassName('inner type-warning').length).toBe(1);
  });
});
