import React from 'react';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../../../test/jest/__mock__';
import DnDContext from '../../DnDContext';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import InstanceMovementDetails from './InstanceMovementDetails';

jest.mock('../../ViewInstance/ViewInstancePane/ViewInstancePane', () => ({
  __esModule: true,
  default: jest.fn(({ onClose, actionMenu, holdingsSection }) => (
    <div>
      <button type="button" onClick={onClose}>Close</button>
      {actionMenu({ onToggle: jest.fn() })}
      {holdingsSection}
    </div>
  )),
}));

jest.mock('../../HoldingsList', () => ({
  __esModule: true,
  HoldingsListContainer: jest.fn().mockReturnValue('HoldingsListContainer'),
}));

jest.mock('./InstanceMovementDetailsActions', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('Action Menu'),
}));

const queryClient = new QueryClient();

const referenceData = {
  activeDropZone: null,
  isItemsDroppable: false,
};

const onClose = jest.fn();
const instance = { id: 'test', source: 'MARC' };
const hasMarc = true;
const id = 'movement-instance-details';

const renderInstanceMovementDetails = () => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <DnDContext.Provider value={referenceData}>
      <InstanceMovementDetails
        instance={instance}
        hasMarc={hasMarc}
        id={id}
        onClose={onClose}
      />
    </DnDContext.Provider>
  </QueryClientProvider>,
  translationsProperties
);

describe('InstanceMovementDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('render DOM', () => {
    renderInstanceMovementDetails();
  });
  it('click Close button', () => {
    renderInstanceMovementDetails();
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(instance);
  });
  it('render Action Menu', () => {
    renderInstanceMovementDetails();
    const actionMenu = screen.getByText(/Action Menu/i);
    expect(actionMenu).toBeInTheDocument();
  });
  it('render HoldingsListContainer', () => {
    renderInstanceMovementDetails();
    expect(screen.getByText(/HoldingsListContainer/i)).toBeInTheDocument();
  });
});
