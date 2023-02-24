import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import LanguageFields from './languageFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <LanguageFields />
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

const renderLanguageFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('LanguageFields', () => {
  it('renders LanguageFields', () => {
    renderLanguageFields();
    expect(screen.getByText(/Languages/i)).toBeInTheDocument();
  });
  it('click the Add language button', () => {
    renderLanguageFields();
    const addButton = screen.getByText(/Add language/i);
    userEvent.click(addButton);
    expect(screen.getAllByText(/Language/i)).toBeDefined();
    const dropdownLanguage = screen.getAllByText(/Language/i);
    expect(dropdownLanguage).toHaveLength(69);
  });
});
