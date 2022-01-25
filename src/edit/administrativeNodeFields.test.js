import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import stripesFinalForm from '@folio/stripes/final-form';

import AdministrativeNoteFields from './administrativeNoteFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();
const administrativeNotes = [
  'note1',
];

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <AdministrativeNoteFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderAdministrativeNoteFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} initialValues={{ administrativeNotes }} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('administrativeNoteFields', () => {
  test('renders', () => {
    renderAdministrativeNoteFields();
    expect(screen.getByRole('textbox', { name: /administrative note/i })).toHaveValue('note1');
  });

  test('adds new note', async () => {
    renderAdministrativeNoteFields();
    userEvent.click(screen.getByText(/add administrative note/i));
    const notes = await screen.findAllByRole('textbox');
    expect(notes).toHaveLength(2);
  });
});
