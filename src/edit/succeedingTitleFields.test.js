import React from 'react';
import PropTypes from 'prop-types';
import '../../test/jest/__mock__';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SucceedingTitles from './succeedingTitleFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.mock('../components', () => ({
  TitleField: jest.fn(() => 'mocked TitleField'),
}));

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <SucceedingTitles />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderSucceedingTitles = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('SucceedingTitles', () => {
  test('Add succeeding title should be in the document', () => {
    const { getByText } = renderSucceedingTitles();
    expect(getByText('Add succeeding title')).toBeInTheDocument();
    expect(getByText('Succeeding titles')).toBeInTheDocument();
  });
  it('click Add succeeding title button', () => {
    const { getByText } = renderSucceedingTitles();
    const succeedingButton = getByText(/Add succeeding title/i);
    fireEvent.click(succeedingButton);
    expect(getByText(/mocked TitleField/i)).toBeInTheDocument();
  });
});
