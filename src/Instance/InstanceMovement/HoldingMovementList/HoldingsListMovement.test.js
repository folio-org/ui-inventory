import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import '../../../../test/jest/__mock__';
import { DataContext } from '../../../contexts';
import DnDContext from '../../DnDContext';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import HoldingsListMovement from './HoldingsListMovement';

jest.mock('../../HoldingsList/Holding/HoldingContainer', () => jest.fn().mockReturnValue('HoldingContainer'));

const history = createMemoryHistory();

const referenceData = {
  selectItemsForDrag:jest.fn(),
  isItemsDragSelected:jest.fn(),
  selectHoldingsForDrag:jest.fn(),
  isHoldingDragSelected:jest.fn(),
  getDraggingItems:jest.fn(),
  activeDropZone:jest.fn(),
  draggingHoldingsCount:jest.fn(),
};

const locations = {
  'fcd64ce1-6995-48f0-840e-89ffa2288371':
  {
    id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
    name: 'Main Library',
    isActive: true,
  },
  'fcd64ce1-6995-48f0-840e-89ffa2288372' :
  {
    id: 'fcd64ce1-6995-48f0-840e-89ffa2288372',
    name: 'Annex',
    isActive: false,
  },
};

const defaultProps = {
  instance: { id: '123', title: 'Test Instance' },
  draggable: true,
  droppable: true,
};

const holdingData = [
  { id: '1', title: 'Test Holding 1' },
];

const HoldingsListMovementSetup = ({ holdings }) => (
  <MemoryRouter>
    <HoldingsListMovement {...defaultProps} holdings={holdings} />
  </MemoryRouter>
);

const renderHoldingsListMovement = (holdings = holdingData) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ locationsById: locations }}>
      <DnDContext.Provider value={referenceData}>
        <HoldingsListMovementSetup holdings={holdings} />
      </DnDContext.Provider>
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('HoldingsListMovement', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    renderHoldingsListMovement();
  });
  it('Component should render correctly', () => {
    const Container = screen.getByText(/HoldingContainer/i);
    expect(Container).toBeInTheDocument();
  });
});

const instance = { id: '123', title: 'Test Instance' };

const renderHoldingsListMovementOrOperation = () => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ locationsById: locations }}>
      <DnDContext.Provider value={referenceData}>
        <HoldingsListMovement
          instance={instance}
        />
      </DnDContext.Provider>
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('renderHoldingsListMovementOrOperation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    renderHoldingsListMovementOrOperation();
  });
  it('render HoldingsListMovementOrOperation correctly', () => {
    const Drop = screen.getByText(/Drop holding/i);
    expect(Drop).toBeInTheDocument();
  });
});
