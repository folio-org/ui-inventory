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
  noteTypeIdField: 'noteTypeIdField',
  noteTypeOptions: [{ name: 'noteTypeName', id: '123456789' }],
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
  it('should render a legend', () => {
    renderNoteFields();

    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  describe('when clicking on Add note button', () => {
    it('correct fields should be rendered', () => {
      renderNoteFields();

      const addNoteButton = screen.getByText('Add note');
      userEvent.click(addNoteButton);

      const relationshipDropdown = screen.getAllByRole('option');

      // where 1 of options is a default option
      expect(relationshipDropdown).toHaveLength(2);
      expect(screen.getAllByText(/Note type/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Note/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Staff only/i)[0]).toBeInTheDocument();
    });
  });
});
