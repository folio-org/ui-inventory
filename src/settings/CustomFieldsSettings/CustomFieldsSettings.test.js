
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import { useStripes } from '@folio/stripes/core';
import {
  ViewCustomFieldsSettings,
  EditCustomFieldsSettings,
} from '@folio/stripes/smart-components';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import CustomFieldsSettings from './CustomFieldsSettings';
import { ENTITY_TYPE_ITEM_INVENTORY } from '../../constants';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewCustomFieldsSettings: jest.fn(() => <div>ViewCustomFieldsSettings</div>),
  EditCustomFieldsSettings: jest.fn(() => <div>EditCustomFieldsSettings</div>),
}));

const renderCustomFieldsSettings = ({ initialEntries }) => renderWithIntl(
  <MemoryRouter initialEntries={initialEntries}>
    <CustomFieldsSettings />
  </MemoryRouter>,
  translationsProperties,
);

describe('Custom fields settings page', () => {
  afterEach(() => {
    useStripes.mockClear();
  });

  it('should render ViewCustomFieldsSettings with entityType and permissions for the item entity', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/inventory/itemCustomFields'],
    });

    await screen.findByText('ViewCustomFieldsSettings');

    expect(ViewCustomFieldsSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: ENTITY_TYPE_ITEM_INVENTORY,
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
        },
      }),
      expect.anything(),
    );
  });

  it('should render EditCustomFieldsSettings with entityType and permissions for the item entity', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/inventory/itemCustomFields/edit'],
    });

    await screen.findByText('EditCustomFieldsSettings');

    expect(EditCustomFieldsSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: ENTITY_TYPE_ITEM_INVENTORY,
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
        },
      }),
      expect.anything(),
    );
  });

  it('should only grant view permission when the user lacks edit/delete permissions', async () => {
    useStripes.mockReturnValueOnce({
      hasPerm: (permName) => permName === 'ui-inventory.settings.custom-fields.view',
    });

    renderCustomFieldsSettings({
      initialEntries: ['/settings/inventory/itemCustomFields'],
    });

    await screen.findByText('ViewCustomFieldsSettings');

    expect(ViewCustomFieldsSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        permissions: {
          canView: true,
          canEdit: false,
          canDelete: false,
        },
      }),
      expect.anything(),
    );
  });
});
