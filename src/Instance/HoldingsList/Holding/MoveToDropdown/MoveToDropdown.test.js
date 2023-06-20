import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { DataContext } from '../../../../contexts';
import DnDContext from '../../../DnDContext';
import '../../../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';

import { MoveToDropdown } from './MoveToDropdown';

const history = createMemoryHistory();

const holding = {
  id: 0,
  instanceId: 1
};

const holdings = [
  {
    id: 2,
    instanceId: 2
  },
  {
    id: 3,
    instanceId: 3
  }
];

const allHoldings = [
  {
    id: 1,
    instanceId: 1
  },
  {
    id: 2,
    instanceId: 2
  },
  {
    id: 3,
    instanceId: 3
  }
];

const instancesData = [
  {
    id: 2,
    title: 'instance 1'
  },
  {
    id: 3,
    title: 'instance 2'
  }
];

const selectedItemsMap = [
  {
    id: 9,
    instanceId: 109,
  },
  {
    id: 10,
    instanceId: 109,
  }
];

const renderMoveToDropdown = (holdingData, holdingsData, selectedItemsMapData = [], allHoldingsData = null) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ locationsById: {} }}>
      <DnDContext.Provider
        value={{
          instances: instancesData,
          selectedItemsMap: selectedItemsMapData,
          allHoldings: allHoldingsData,
          onSelect: jest.fn()
        }}
      >
        <MoveToDropdown
          holding={holdingData}
          holdings={holdingsData}
        />
      </DnDContext.Provider>
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('MoveToDropdown', () => {
  it('Component should render correctly', () => {
    renderMoveToDropdown(holding, holdings, selectedItemsMap, allHoldings);
    expect(screen.getByRole('button', { name: 'Move to' }));
  });
  it('instance titles should render on button click', () => {
    renderMoveToDropdown(holding, holdings, selectedItemsMap, allHoldings);
    userEvent.click(screen.getByRole('button', { name: 'Move to' }));
    expect(screen.getByText('instance 1')).toBeInTheDocument();
    expect(screen.getByText('instance 2')).toBeInTheDocument();
  });
  it('Component should render correctly when allHoldings is empty', () => {
    renderMoveToDropdown(holding, holdings, selectedItemsMap);
    userEvent.click(screen.getByRole('button', { name: 'Move to' }));
    expect(screen.getByText('instance 1')).toBeInTheDocument();
    expect(screen.getByText('instance 2')).toBeInTheDocument();
  });
  it('Component should render correctly when selectedItemsMap is empty', () => {
    renderMoveToDropdown(holding, holdings);
    userEvent.click(screen.getByRole('button', { name: 'Move to' }));
    expect(screen.getByText('instance 1')).toBeInTheDocument();
  });
  it('instance 2 title should be render', () => {
    const holding2 = {
      id: 2,
      instanceId: 2
    };
    renderMoveToDropdown(holding2, holdings, selectedItemsMap);
    userEvent.click(screen.getByRole('button', { name: 'Move to' }));
    expect(screen.getByText('instance 2')).toBeInTheDocument();
  });
});
