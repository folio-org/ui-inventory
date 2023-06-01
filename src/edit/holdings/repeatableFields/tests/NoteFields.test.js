import PropTypes from 'prop-types';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';

import NoteFields from '../NoteFields';
import translationsProperties from '../../../../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  noteTypeOptions: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ],
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <NoteFields {...props} />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  canAdd: true,
  canEdit: true,
})(Form);

const renderNote = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('Note component', () => {
  it('renders the button with the text "Add note"', () => {
    const { getByText } = renderNote();
    expect(getByText(/Add note/i)).toBeInTheDocument();
  });
  it('click the note button', () => {
    const { getByText, getByLabelText, getByRole } = renderNote();
    const noteButton = getByText(/Add note/i);
    userEvent.click(noteButton);
    expect(getByLabelText(/Note type/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Note/i)).toBeTruthy();
    expect(getByLabelText(/Staff only/i)).toBeInTheDocument();
    const option = getByLabelText(/Note type/i);
    expect(option).toHaveLength(3);
    const noteArea = getByRole('textbox');
    userEvent.type(noteArea, 'hello');
    expect(noteArea.textContent).toBe('hello');
  });
});
