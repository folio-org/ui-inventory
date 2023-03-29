import React from 'react';
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
    const { container } = renderHRIDHandlingForm(defaultProps);
    expect(container.getElementsByClassName('descriptionRow row').length).toBe(3);
  });
});
