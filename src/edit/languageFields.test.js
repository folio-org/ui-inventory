import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import LanguageFields from './languageFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const form = {
  getState: jest.fn().mockReturnValue({
    values: {
      languages: [],
    },
  }),
  initialize: jest.fn(),
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <LanguageFields form={form} />
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

  describe('when clicking the Add language button', () => {
    it('dropdown with language list should be rendered', () => {
      renderLanguageFields();
      const addButton = screen.getByText(/Add language/i);
      fireEvent.click(addButton);

      expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument();
    });
  });
});
