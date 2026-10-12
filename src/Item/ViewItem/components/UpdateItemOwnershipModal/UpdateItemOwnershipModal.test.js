import React from 'react';
import noop from 'lodash/noop';

import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { FieldHolding } from '@folio/stripes-acq-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import UpdateItemOwnershipModal from './UpdateItemOwnershipModal';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldHolding: jest.fn(() => <span>FieldHolding</span>),
}));

const onChangeAffiliationMock = jest.fn();

const defaultProps = {
  isOpen: true,
  handleSubmit: noop,
  onCancel: noop,
  onChangeAffiliation: onChangeAffiliationMock,
  targetTenantId: null,
  instanceId: 'instanceId',
  tenantsList: [{ id: 'university', name: 'University' }],
};

const renderUpdateItemOwnershipModal = () => renderWithIntl(
  <UpdateItemOwnershipModal {...defaultProps} />,
  translationsProperties
);

describe('UpdateItemOwnershipModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderUpdateItemOwnershipModal();

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', async () => {
    renderUpdateItemOwnershipModal();
    const updateOwnershipModal = await screen.findByText('Update ownership');

    expect(updateOwnershipModal).toBeInTheDocument();
  });

  describe('when change the affiliation', () => {
    it('should call the function to change the affiliation', () => {
      renderUpdateItemOwnershipModal();

      fireEvent.click(screen.getByText('Select control'));
      fireEvent.click(screen.getByText('University'));

      expect(onChangeAffiliationMock).toHaveBeenCalledWith(defaultProps.tenantsList[0]);
    });
  });

  describe('when select affiliation and holding', () => {
    it('should enable "Update" button', () => {
      renderUpdateItemOwnershipModal();

      fireEvent.click(screen.getByText('Select control'));
      fireEvent.click(screen.getByText('University'));

      FieldHolding.mock.calls[0][0].onChange({ id: 'locationId' });

      expect(screen.getByText('Update')).not.toBeDisabled();
    });
  });
});
