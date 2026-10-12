import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import DisplaySettings from './DisplaySettings';

const renderDisplaySettings = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <Form
      onSubmit={() => {}}
      mutators={arrayMutators}
      initialValues={{}}
      render={formProps => (
        <DisplaySettings
          {...props}
          {...formProps}
        />
      )}
    />
  </MemoryRouter>,
  translationsProperties
);

describe('DisplaySettings', () => {
  it('should render with no axe errors', async () => {
    const { container } = renderDisplaySettings();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display sort options', () => {
    const { getByRole } = renderDisplaySettings();

    expect(getByRole('option', { name: 'Title' })).toBeInTheDocument();
    expect(getByRole('option', { name: 'Contributors' })).toBeInTheDocument();
    expect(getByRole('option', { name: 'Relevance' })).toBeInTheDocument();
    expect(getByRole('option', { name: 'Date' })).toBeInTheDocument();
  });

  it('should display column options', () => {
    const { getByRole } = renderDisplaySettings();

    expect(getByRole('checkbox', { name: 'Contributors' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Date' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Publishers' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Relation' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Instance HRID' })).toBeInTheDocument();
  });
});
