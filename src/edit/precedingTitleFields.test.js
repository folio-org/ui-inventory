import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import PrecedingTitles from './precedingTitleFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={ handleSubmit }>
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
    renderPrecedingTitles();
    expect(screen.getByText('Preceding titles')).toBeInTheDocument();
  });
  it('click on Add preceeding title button ', () => {
    renderPrecedingTitles();
    const preceedingButton = screen.getByText('Add preceding title');
    userEvent.click(preceedingButton);
    const myText = screen.getByRole('textbox', { name: 'ISBN' });
    expect(myText).toHaveValue('');
    userEvent.type(myText, 'Enter text for ISBN');
    expect(myText).toHaveValue('Enter text for ISBN');
  });
});
