import React from 'react';
import { screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import HRIDHandlingForm from './HRIDHandlingForm';

const history = createMemoryHistory();
const defaultProps = {
  initialValues: {
    metadata: {}
  },
  handleSubmit: jest.fn(),
  pristine: true,
  submitting: true,
  form: {
    reset: jest.fn()
  },
  render: jest.fn()
};

const renderHRIDHandlingForm = (props) => renderWithIntl(
  <Router history={history}>
    <HRIDHandlingForm {...props} onSubmit={jest.fn()} />
  </Router>,
  translationsProperties
);

describe('HRIDHandlingForm', () => {
  it('Component should render', () => {
    renderHRIDHandlingForm(defaultProps);
    expect(screen.getAllByText('HRID handling').length).toBe(2);
    expect(screen.getByText('ViewMetaData')).toBeInTheDocument();
    expect(screen.getByText('After initial data migration, new FOLIO HRIDs are assigned sequentially, based on the starting number in these settings')).toBeInTheDocument();
    expect(screen.getByText('Unless changed or removed, the default prefix will be assigned to new FOLIO HRIDs')).toBeInTheDocument();
    expect(screen.getByText('HRIDs in existing FOLIO Inventory and MARC records cannot be changed')).toBeInTheDocument();
  });
});
