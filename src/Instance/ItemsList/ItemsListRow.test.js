import React from 'react';
import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import { renderWithIntl } from '../../../test/jest/helpers';

import ItemsListRow from './ItemsListRow';

jest.mock('react-beautiful-dnd', () => ({
  Draggable: jest.fn().mockImplementation(({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  },
  {
    isDragging: false
  }))
    .mockImplementationOnce(({ children }) => children({
      draggableProps: {
        style: {},
      },
      innerRef: jest.fn(),
    },
    {
      isDragging: true
    })),
}));

const mockisItemsDragSelected = jest.fn();
const defaultProps = {
  rowClass: [
    'RowClass 1',
    'RowClass 2',
    'RowClass 3'
  ],
  cells: [
    'cell 1',
    'cell 2',
    'cell 3'
  ],
  rowIndex: 1,
  rowData: {
    id: 'testID'
  },
  rowProps: {
    draggable: false,
    isItemsDragSelected: mockisItemsDragSelected,
    getDraggingItems: jest.fn().mockReturnValue({
      items: {
        length: 5
      }
    })
  },
};

const renderItemsListRow = (props) => {
  let container = document.getElementById('ModuleContainer');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'ModuleContainer');
    document.body.appendChild(container);
  }
  renderWithIntl(<ItemsListRow {...props} />);
};


describe('ItemsListRow', () => {
  it('Message should render when isDragging of snapshot is true', () => {
    renderItemsListRow(defaultProps);
    expect(screen.queryByText('ui-inventory.moveItems.move.items.count')).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: 'cell 1cell 2cell 3' })).not.toBeInTheDocument();
  });
  it('Row Data should render when isDragging of snapshot is false', () => {
    renderItemsListRow(defaultProps);
    expect(screen.queryByText('ui-inventory.moveItems.move.items.count')).not.toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'cell 1cell 2cell 3' })).toBeInTheDocument();
  });
});
