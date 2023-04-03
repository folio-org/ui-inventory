import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

import AlternativeTitles from './alternativeTitles';


jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  alternativeTitleTypes: [
    { id: '1', name: 'Title Type 1' },
  ],
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <AlternativeTitles {...props} />
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

const renderAlternativeTitles = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('AlternativeTitles', () => {
  it('renders the form with the correct elements', () => {
    renderAlternativeTitles();
    expect(screen.getByText(/Alternative titles/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/Add alternative title/i));
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Alternative title/i)).toBeInTheDocument();
  });
});