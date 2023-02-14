import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import ElectronicAccessFields from './electronicAccessFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  relationship: [{ name: 'relationshipName', id: '789789' }]
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <ElectronicAccessFields {...props} />
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

const renderElectronicAccessFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('ElectronicAccessFields', () => {
  it('renders RepeatableField', () => {
    renderElectronicAccessFields();
    expect(screen.getByText('Electronic access')).toBeInTheDocument();
  });

  it('click on Add electronic access button and check the fields', () => {
    renderElectronicAccessFields();
    const electronicButton = screen.getByText('Add electronic access');
    userEvent.click(electronicButton);
    const RelationshipDropdown = screen.getAllByText('Relationship');
    expect(RelationshipDropdown).toHaveLength(1);
    expect(screen.getByText('URI')).toBeInTheDocument();
    expect(screen.getByText('Link text')).toBeInTheDocument();
    expect(screen.getByText('Materials specified')).toBeInTheDocument();
    expect(screen.getByText('URL public note')).toBeInTheDocument();
    const myURIText = screen.getByRole('textbox', { name: 'URI' });
    expect(myURIText).toHaveValue('');
    userEvent.type(myURIText, 'Entered text inside URI Text field');
    expect(myURIText).toHaveValue('Entered text inside URI Text field');
    const myLinkText = screen.getByRole('textbox', { name: 'Link text' });
    expect(myLinkText).toHaveValue('');
    userEvent.type(myLinkText, 'Entered text inside Link text field');
    expect(myLinkText).toHaveValue('Entered text inside Link text field');
    const myMaterialsText = screen.getByRole('textbox', { name: 'Materials specified' });
    expect(myMaterialsText).toHaveValue('');
    userEvent.type(myMaterialsText, 'Entered text inside Materials specified text field');
    expect(myMaterialsText).toHaveValue('Entered text inside Materials specified text field');
    const myURLText = screen.getByRole('textbox', { name: 'URL public note' });
    expect(myURLText).toHaveValue('');
    userEvent.type(myURLText, 'Entered text inside URL public note text field');
    expect(myURLText).toHaveValue('Entered text inside URL public note text field');
  });
});

