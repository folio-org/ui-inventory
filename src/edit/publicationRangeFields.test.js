import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import PublicationRangeFields from './publicationRangeFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <PublicationRangeFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderPublicationRangeFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('PublicationRangeFields', () => {
  test('renders repeatable field', () => {
    renderPublicationRangeFields();
    expect(screen.getByText('Publication range')).toBeInTheDocument();
  });

  test('Click on Add range button and enter value in Publication Range text field', async () => {
    renderPublicationRangeFields();
    const rangeButton = screen.getByText('Add range');
    fireEvent.click(rangeButton);
    const myText = screen.getByRole('textbox', { name: 'Publication range' });
    expect(myText).toHaveValue('');
    fireEvent.change(myText, { target: { value: 'Enter text for Publication Range text field' } });
    expect(myText).toHaveValue('Enter text for Publication Range text field');
  });
});
