import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import InstanceFormatFields from './instanceFormatFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');
const onSubmit = jest.fn();
const props = {
  fieldIndex: 0,
  instanceFormats: [
    {
      name: 'instanceFormatIds',
      id:'ui-inventory.instanceFormats'
    },
  ],
  id:'ui-inventory.instanceFormats',
  canAdd: true,
  canEdit: true,
  canDelete: true,
  instanceFormatOptions: []
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <InstanceFormatFields {...props} />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
})(Form);

const renderInstanceFormatFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());
describe('InstanceFormatFields', () => {
  it('Add format should be in the document ', () => {
    renderInstanceFormatFields();
    expect(screen.getByText('Add format')).toBeInTheDocument();
  });

  it('option should be selected', async () => {
    renderInstanceFormatFields();
    userEvent.click(screen.getByRole('button'));
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'instanceFormatIds' }),
    );
    expect(screen.getByRole('option', { name: 'instanceFormatIds' }).selected).toBe(true);
  });

  it('selecting empty value option', async () => {
    renderInstanceFormatFields();
    userEvent.click(screen.getByRole('button'));
    userEvent.click(document.querySelector('[name="instanceFormatIds[0]"]'));
    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Select format' }),
    );
    expect(screen.findByDisplayValue('')).toBeTruthy();
  });
  it('instanceFormats map length should passed', async () => {
    renderInstanceFormatFields(props);
    expect(props.instanceFormats.map).toHaveLength(1);
  });
});
