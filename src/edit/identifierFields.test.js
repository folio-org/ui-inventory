import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import IdentifierFields from './identifierFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  identifierTypes: [{ name: 'identifyName', id: '129459' }]
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <IdentifierFields {...props} />
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

const renderIdentifierFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('IdentifierFields', () => {
  it('renders RepeatableField', () => {
    renderIdentifierFields();
    expect(screen.getByText('Identifiers')).toBeInTheDocument();
  });
  it('click Add identifier button and check Type dropdown length, enter value in text box', () => {
    renderIdentifierFields();
    const identifierButton = screen.getByText('Add identifier');
    fireEvent.click(identifierButton);
    const TypeDropdown = screen.getAllByText('Select identifier type');
    expect(TypeDropdown).toHaveLength(1);
    const myText = screen.getByRole('textbox');
    expect(myText).toHaveValue('');
    fireEvent.change(myText, { target: { value: 'Enter text' } });
    expect(myText).toHaveValue('Enter text');
  });
});
