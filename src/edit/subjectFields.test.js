import PropTypes from 'prop-types';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import '../../test/jest/__mock__';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SubjectFields from './subjectFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <SubjectFields />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: false,
})(Form);

const renderSubjectFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('SubjectFields', () => {
  test('Add subject should be in the document', () => {
    renderSubjectFields();
    expect(screen.getByText('Add subject')).toBeInTheDocument();
  });

  test('Entering value in text box', async () => {
    renderSubjectFields();
    const subject = screen.getByText('Add subject');
    userEvent.click(subject);
    const inputText = screen.getByRole('textbox', { name: 'Subjects' });
    expect(inputText).toHaveValue('');
    userEvent.type(inputText, 'Enter text for subjects');
    expect(inputText).toHaveValue('Enter text for subjects');
  });
});
