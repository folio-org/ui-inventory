import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import NoteFields from './noteFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  instanceNoteTypes: [{ name: 'instanceNoteTypesName', id: '123456789' }]
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
  canDelete: true,
})(Form);

const renderNoteFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('NoteFields', () => {
  it('renders RepeatableField', () => {
    renderNoteFields();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });
  it('click on Add note button', () => {
    renderNoteFields();
    const addNoteButton = screen.getByText('Add note');
    userEvent.click(addNoteButton);
    const RelationshipDropdown = screen.getAllByText('instanceNoteTypesName');
    expect(RelationshipDropdown).toHaveLength(1);
  });
});
