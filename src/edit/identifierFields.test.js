import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import {
  NUMBER_GENERATOR_OPTIONS_OFF,
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
} from '../settings/NumberGeneratorSettings/constants';
import IdentifierFields from './identifierFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  identifierTypes: [{ name: 'identifyName', id: '129459' }]
};

const Form = ({ handleSubmit, identifierFieldsProps = {} }) => (
  <form onSubmit={handleSubmit}>
    <IdentifierFields {...props} {...identifierFieldsProps} />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  identifierFieldsProps: PropTypes.object,
};

const WrappedForm = stripesFinalForm({
  canAdd: true,
  canEdit: true,
  canDelete: true,
})(Form);

const renderIdentifierFields = (identifierFieldsProps = {}) => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} identifierFieldsProps={identifierFieldsProps} />),
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

  describe('Number generator button', () => {
    const addIdentifier = () => fireEvent.click(screen.getByText('Add identifier'));

    describe('when number generator settings for identifier is "onNotEditable"', () => {
      it('should render generate identifier button and disable identifier field', () => {
        renderIdentifierFields({
          numberGeneratorData: { identifier: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE },
        });
        addIdentifier();

        expect(screen.getByRole('button', { name: 'Generate identifier' })).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeDisabled();
      });
    });

    describe('when number generator settings for identifier is "onEditable"', () => {
      it('should render generate identifier button and enable identifier field', () => {
        renderIdentifierFields({
          numberGeneratorData: { identifier: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE },
        });
        addIdentifier();

        expect(screen.getByRole('button', { name: 'Generate identifier' })).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeEnabled();
      });
    });

    describe('when number generator settings for identifier is "off"', () => {
      it('should not render generate identifier button and enable identifier field', () => {
        renderIdentifierFields({
          numberGeneratorData: { identifier: NUMBER_GENERATOR_OPTIONS_OFF },
        });
        addIdentifier();

        expect(screen.queryByRole('button', { name: 'Generate identifier' })).not.toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeEnabled();
      });
    });
  });
});
