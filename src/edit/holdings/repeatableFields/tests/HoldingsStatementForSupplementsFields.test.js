import React from 'react';
import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import '../../../../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import HoldingsStatementForSupplementsFields from '../HoldingsStatementForSupplementsFields';
import translationsProperties from '../../../../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <HoldingsStatementForSupplementsFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderHoldingsStatementForSupplementsFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('HoldingsStatementForSupplementsFields', () => {
  test('Add holdings statement for supplements should be in the document', () => {
    renderHoldingsStatementForSupplementsFields();
    expect(screen.getByText('Add holdings statement for supplements')).toBeInTheDocument();
  });

  test('Text boxes length should be 3', async () => {
    renderHoldingsStatementForSupplementsFields();
    fireEvent.click(screen.getByText('Add holdings statement for supplements'));
    const notes = await screen.findAllByRole('textbox');
    expect(notes).toHaveLength(3);
  });
});
