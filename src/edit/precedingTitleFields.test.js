import PropTypes from 'prop-types';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import PrecedingTitles from './precedingTitleFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

jest.mock('../components', () => ({
  TitleField: jest.fn(() => 'mocked TitleField'),
}));

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <PrecedingTitles />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const renderPrecedingTitles = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

const WrappedForm = stripesFinalForm({
  canAdd: true,
  canEdit: true,
  canDelete: true,
  isDisabled: false,
})(Form);

afterEach(() => jest.clearAllMocks());

describe('precedingTitleFields', () => {
  it('renders RepeatableField', () => {
    const { getByText } = renderPrecedingTitles();
    expect(getByText(/Preceding titles/i)).toBeInTheDocument();
    expect(getByText(/Add preceding title/i)).toBeInTheDocument();
  });
  it('click Add preceding title button', () => {
    const { getByText } = renderPrecedingTitles();
    const precedingButton = getByText(/Add preceding title/i);
    userEvent.click(precedingButton);
    expect(getByText(/mocked TitleField/i)).toBeInTheDocument();
  });
});
