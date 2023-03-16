import PropTypes from 'prop-types';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SeriesFields from './seriesFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <SeriesFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderSeriesFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('SeriesFields', () => {
  test('Add series button should be in the document', () => {
    renderSeriesFields();
    expect(screen.getByText('Add series')).toBeInTheDocument();
  });

  test('Series statements text field and  Add series button', async () => {
    renderSeriesFields();
    expect(screen.getByText('Series statements')).toBeInTheDocument();
    const seriesButton = screen.getByText('Add series');
    userEvent.click(seriesButton);
    const myText = screen.getByRole('textbox');
    expect(myText).toHaveValue('');
    fireEvent.change(myText, { target: { value: 'Enter text inside Text field' } });
    expect(myText).toHaveValue('Enter text inside Text field');
  });
});
