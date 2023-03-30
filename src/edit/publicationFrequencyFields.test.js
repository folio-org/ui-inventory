import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';
import PublicationFrequencyFields from './publicationFrequencyFields';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <PublicationFrequencyFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderPublicationFrequencyFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('PublicationFrequencyFields', () => {
  test('renders Publication frequency field', () => {
    renderPublicationFrequencyFields();
    expect(screen.getByText('Publication frequency')).toBeInTheDocument();
  });

  test('Click on Add range button and enter value in Publication frequency text field', async () => {
    renderPublicationFrequencyFields();
    userEvent.click(screen.getByRole('button'));
    const rangeButton = screen.getByText('Add frequency');
    userEvent.click(rangeButton);
    const myText = screen.getByRole('textbox', { name: 'Publication frequency' });
    expect(myText).toHaveValue('');
    userEvent.type(myText, 'Enter text for Publication frequency text field');
    expect(myText).toHaveValue('Enter text for Publication frequency text field');
  });
});
