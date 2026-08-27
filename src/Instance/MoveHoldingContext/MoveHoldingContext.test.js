import React from 'react';
import { cleanup, fireEvent, screen, waitFor, act} from '@testing-library/react';
import { Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import '../../../test/jest/__mock__/stripesComponents.mock';
import '../../../test/jest/__mock__/stripesSmartComponents.mock';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { createMemoryHistory } from 'history';
import { DataContext } from '../../contexts';
import DnDContext from '../DnDContext';
import MoveHoldingContext from './MoveHoldingContext';
import userEvent from '@testing-library/user-event';

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn()}),
}));

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useMoveItemsMutation: () => mockUseMoveItemsMutationReturn
}));

const mockUseMoveItemsMutationReturn = { mutate: jest.fn() }

jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: (prop) => {
    const { onBeforeCapture, onDragStart, onDragEnd, children } = prop;
    const result = {
      draggableId: 'holding-id-2',
      source: {
        droppableId: 1
      },
      destination: {
        droppableId: 2
      }
    }
    const target = {
      dataset: {
        toId: 2,
        itemId: 1,
        isHolding: true
      }
    }
    const Component = <div>
      <div>
        <button type="button" onClick={() => onBeforeCapture(result)}>onBeforeCapture</button>
        <button type="button" onClick={() => onDragStart(result)}>onDragStart</button>
        <button type="button" onClick={() => onDragEnd(result)}>onDragEnd</button>
      </div>
      <div>{children}</div>
    </div>
    return (Component);
  },
}));


jest.mock('../../providers', () => ({
  ...jest.requireActual('../../providers'),
  useHoldings: jest.fn().mockReturnValue({
    holdingsById: [
      {
        id: 'holding-id-3',
        permanentLocationId: 3
      },
      {
        id: 'holding-id-1',
        permanentLocationId: 2
      },
      {
        id: 'holding-id-2',
        permanentLocationId: 3
      },
    ],
  }),
  useInstanceHoldingsQuery: jest.fn().mockReturnValue(
    {
      holdingsRecords: [{
        leftHoldings: {
          id: 'holding-id-2',
        }
      }]
    }
  ).mockReturnValueOnce(
    {
      holdingsRecords: [{
        rightHoldings: {
          id: 'holding-id-1',
        }
      }]
    }
  )
}));

const queryClient = new QueryClient()
const history = createMemoryHistory();

const leftInstance= {
  id: 'holding-id-1',
  title: 'LeftInstance Title',
};
const rightInstance= {
  id: 'holding-id-2',
  title: 'RightInstance Title'
};
const mockedMoveHoldings = jest.fn().mockResolvedValue({});

const Child = () => {
  return (
    <div>
      <span>MoveHoldingContext</span>
    </div>
  );
}
const renderMoveHoldingContext = () => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <Router history={history}>
      <DataContext.Provider value={{ locationsById: {} }}>
        <DnDContext.Provider value={{ activeDropZone: true }}>
        <MoveHoldingContext
          leftInstance={leftInstance}
          rightInstance={rightInstance}
          moveHoldings={mockedMoveHoldings}
        >
          <Child />
        </MoveHoldingContext>
        </DnDContext.Provider>
      </DataContext.Provider>
    </Router>
  </QueryClientProvider>,
  translationsProperties
);

describe('MoveHoldingContext', () => {
  beforeEach(() => {
    cleanup();
  });
  it('Component should render correctly', () => {
    renderMoveHoldingContext();
    expect(screen.getByText('MoveHoldingContext')).toBeInTheDocument();
    expect(screen.getByText('0 items will be moved to')).toBeInTheDocument();
  });
  it('LeftInstance Title should render when onBeforeCapture is clicked', () => {
    renderMoveHoldingContext();
    userEvent.click(screen.getByText('onBeforeCapture'));
    userEvent.click(screen.getByText('onDragStart'));
    fireEvent.dragStart(screen.getByText('LeftInstance Title'));
    fireEvent.dragEnd(screen.getByText('LeftInstance Title'));
    expect(screen.getByText('LeftInstance Title')).toBeInTheDocument();
  });
  it('count should render when drag ends ', () => {
    renderMoveHoldingContext();
    userEvent.click(screen.getByText('onDragStart'));
    userEvent.click(screen.getByText('onDragEnd'));
    expect(screen.getByText('1 item will be moved to')).toBeInTheDocument();
  });
  it('MoveHoldings to be called when on clicking confirm button', async () => {
    renderMoveHoldingContext();
    act(() => {
      userEvent.click(screen.getByText('onBeforeCapture'));
      userEvent.click(screen.getByText('onDragStart'));
      userEvent.click(screen.getByText('onDragEnd'));      
    });
    await waitFor(() => {
      userEvent.click(screen.getByText('confirm'));
    });
    expect(mockedMoveHoldings).toHaveBeenCalled();
  });
});
