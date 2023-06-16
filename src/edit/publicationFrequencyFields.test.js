import PropTypes from 'prop-types';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';
import PublicationFrequencyFields from './publicationFrequencyFields';

jest.unmock('@folio/stripes/components');

afterEach(() => jest.clearAllMocks());
describe('PublicationFrequencyFields', () => {
  it('renders Publication frequency field and defult props for all buttons should be enabled', () => {
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
    renderPublicationFrequencyFields();

    expect(screen.getByText('Publication frequency')).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /add frequency/i });
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
    const deleteButton = document.querySelector('[aria-label="Delete this item"]');
    expect(addButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();
    expect(screen.getByRole('textbox')).toBeEnabled();
  });
  it('disables publication frequency input when canEdit is false', () => {
    const onSubmit = jest.fn();
    const Form = ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <PublicationFrequencyFields canEdit={false} />
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
    renderPublicationFrequencyFields();
    expect(screen.getByText('Publication frequency')).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /add frequency/i });
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
  it('disables add publication frequency button when canAdd is false', () => {
    const onSubmit = jest.fn();
    const Form = ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <PublicationFrequencyFields canAdd={false} />
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
    renderPublicationFrequencyFields();
    const addButton = screen.getByRole('button', { name: /add frequency/i });
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
    expect(addButton).toBeDisabled();
  });
  it('disables delete publication frequency button when canDelete is false', () => {
    const onSubmit = jest.fn();
    const Form = ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <PublicationFrequencyFields canDelete={false} />
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
    renderPublicationFrequencyFields();
    const addButton = screen.getByRole('button', { name: /add frequency/i });
    expect(addButton).toBeInTheDocument();
    userEvent.click(addButton);
    const deleteButton = document.querySelector('[aria-label="Delete this item"]');
    expect(deleteButton).toBeDisabled();
  });
});
