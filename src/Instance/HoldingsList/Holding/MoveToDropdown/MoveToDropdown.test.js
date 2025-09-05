import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { DataContext } from '../../../../contexts';
import '../../../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';

import MoveToDropdown from './MoveToDropdown';

const history = createMemoryHistory();

const holding = {
  id: 'holding_1',
  instanceId: 'instance_1',
};

const holdings = [
  {
    id: 'holding_1',
    instanceId: 'instance_1',
  },
  {
    id: 'holding_2',
    instanceId: 'instance_1',
    permanentLocationId: 'location_2',
  },
  {
    id: 'holding_3',
    instanceId: 'instance_1',
    permanentLocationId: 'location_3',
  }
];

const locationsByIdData = {
  location_1: { name: 'location_holding_1' },
  location_2: { name: 'location_holding_2' },
  location_3: { name: 'location_holding_3' },
};

const allHoldings = [
  {
    id: 'holding_1',
    instanceId: 'instance_1',
  },
  {
    id: 'holding_to_1',
    instanceId: 'instance_2',
    permanentLocationId: 'location_1',
  },
  {
    id: 'holding_to_2',
    instanceId: 'instance_2',
    permanentLocationId: 'location_2',
  },
  {
    id: 'holding_to_3',
    instanceId: 'instance_2',
    permanentLocationId: 'location_3',
  }
];

const instancesData = [
  {
    id: 'instance_1',
    title: 'instance 1'
  },
  {
    id: 'instance_2',
    title: 'instance 2'
  }
];

const selectedItemsMap = {
  holding_1: [{}],
  holding_2: [{}],
  holding_3: [{}],
};

const renderMoveToDropdown = ({
  holdingData,
  holdingsData,
}) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ locationsById: locationsByIdData }}>
      <MoveToDropdown
        holding={holdingData}
        holdings={holdingsData}
      />
    </DataContext.Provider>
  </Router>,
  translationsProperties,
);

describe.skip('MoveToDropdown', () => {
  it('should render Move to button', () => {
    renderMoveToDropdown({
      holdingData: holding,
      holdingsData: holdings,
      selectedItemsMapData: selectedItemsMap,
      allHoldingsData: allHoldings,
    });

    expect(screen.getByRole('button', { name: 'Move to' })).toBeInTheDocument();
  });

  describe('when movement is within the instance', () => {
    describe('and no items selected', () => {
      it('should render disabled Move to button', () => {
        renderMoveToDropdown({
          holdingData: holding,
          holdingsData: holdings,
          selectedItemsMapData: [],
        });

        expect(screen.getByRole('button', { name: 'Move to' })).toHaveAttribute('disabled');
      });
    });

    describe('and there is only one holding', () => {
      it('should render disabled Move to button', () => {
        renderMoveToDropdown({
          holdingData: holding,
          holdingsData: [holding],
          selectedItemsMapData: selectedItemsMap,
        });

        expect(screen.getByRole('button', { name: 'Move to' })).toHaveAttribute('disabled');
      });
    });

    describe('and there are selected items', () => {
      it('should render holdings labels in Move to dropdown', () => {
        renderMoveToDropdown({
          holdingData: holding,
          holdingsData: holdings,
          selectedItemsMapData: selectedItemsMap,
        });

        userEvent.click(screen.getByRole('button', { name: 'Move to' }));

        expect(screen.getByText('location_holding_2')).toBeInTheDocument();
        expect(screen.getByText('location_holding_3')).toBeInTheDocument();
      });
    });
  });

  describe('when movement is between instances', () => {
    describe('and no items are selected', () => {
      it('should render instance\'s title in Move to dropdown', () => {
        renderMoveToDropdown({
          holdingData: holding,
          holdingsData: holdings,
          instances: instancesData,
          allHoldingsData: allHoldings,
        });

        userEvent.click(screen.getByRole('button', { name: 'Move to' }));

        expect(screen.getByText('instance 2')).toBeInTheDocument();
      });
    });

    describe('and there are items selected', () => {
      it("should render instance's and holdings' titles in Move to dropdown", () => {
        renderMoveToDropdown({
          holdingData: holding,
          holdingsData: holdings,
          instances: instancesData,
          selectedItemsMapData: selectedItemsMap,
          allHoldingsData: allHoldings,
        });

        userEvent.click(screen.getByRole('button', { name: 'Move to' }));

        expect(screen.getByText('instance 2 location_holding_1')).toBeInTheDocument();
        expect(screen.getByText('instance 2 location_holding_2')).toBeInTheDocument();
        expect(screen.getByText('instance 2 location_holding_3')).toBeInTheDocument();
      });
    });
  });
});
