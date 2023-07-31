import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import PublicationFields from './publicationFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <PublicationFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderPublicationFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('PublicationFields', () => {
  describe('when clicking Add publication', () => {
    test('correct fields should appear', () => {
      renderPublicationFields();

      expect(screen.getByText('Add publication')).toBeInTheDocument();

      const publicationButton = screen.getByText('Add publication');
      fireEvent.click(publicationButton);

      expect(screen.getByText('Publisher')).toBeInTheDocument();
      expect(screen.getByText('Publisher role')).toBeInTheDocument();
      expect(screen.getByText('Place')).toBeInTheDocument();
      expect(screen.getByText('Publication date')).toBeInTheDocument();
    });
  });
});
