import React from 'react';
import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import HoldingsStatementFields from './holdingsStatementFields';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <HoldingsStatementFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderHoldingsStatementFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('HoldingsStatementFields', () => {
  test('Add holdings statement should be in the document', () => {
    renderHoldingsStatementFields();
    expect(screen.getByText('Add holdings statement')).toBeInTheDocument();
  });

  test('Text boxes length should be 3', async () => {
    renderHoldingsStatementFields();
    userEvent.click(screen.getByText('Add holdings statement'));
    const notes = await screen.findAllByRole('textbox');
    expect(notes).toHaveLength(3);
  });
});
