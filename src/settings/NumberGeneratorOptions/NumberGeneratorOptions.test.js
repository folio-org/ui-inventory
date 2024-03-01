import React from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  renderWithRouter,
  translationsProperties
} from '../../../test/jest/helpers';

import NumberGeneratorOptions from './NumberGeneratorOptions';

const onSubmit = jest.fn();

const Form = ({ handleSubmit, ...props }) => (
  <form onSubmit={handleSubmit}>
    <NumberGeneratorOptions {...props} />
  </form>
);

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderNumberGeneratorOptions = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} initialValues={{}} />),
  translationsProperties,
);

describe('Number generator settings', () => {
  it('renders', () => {
    renderNumberGeneratorOptions();

    expect(screen.getByText('ConfigManager')).toBeInTheDocument();
  });
});
