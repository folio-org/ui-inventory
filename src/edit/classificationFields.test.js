import PropTypes from 'prop-types';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import ClassificationFields from './classificationFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  classificationTypes: [{ name: 'classificationName', id: '369369' }]
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <ClassificationFields {...props} />
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

const renderClassificationFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('ClassificationFields', () => {
  it('renders RepeatableField', () => {
    renderClassificationFields();
    expect(screen.getByText('Classification')).toBeInTheDocument();
  });

  it('click on Add classification button and check dropdown length, enter value in text box', () => {
    renderClassificationFields();
    const classificationButton = screen.getByText('Add classification');
    userEvent.click(classificationButton);
    const ClassificationDropdown = screen.getAllByText('Select classification type');
    expect(ClassificationDropdown).toHaveLength(1);
    const inputText = screen.getByRole('textbox');
    expect(inputText).toHaveValue('');
    userEvent.type(inputText, 'Enter text');
    expect(inputText).toHaveValue('Enter text');
  });
});
