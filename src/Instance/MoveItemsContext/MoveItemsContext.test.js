import { cleanup, screen} from '@testing-library/react';
import { Router } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';
import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import '../../../test/jest/__mock__/stripesComponents.mock';
import '../../../test/jest/__mock__/stripesSmartComponents.mock';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { createMemoryHistory } from 'history';
import { DataContext } from '../../contexts';
import MoveItemsContext from './MoveItemsContext';

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
    const { onDragStart, onDragEnd, children } = prop;
    const result = {
      draggableId: 'moveItems-id-2',
      source: {
        droppableId: 1
      },
      destination: {
        droppableId: 2
      }
    }
    const Component = <div>
      <div>
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
        id: 'moveItems-id-3',
        permanentLocationId: 3
      },
      {
        id: 'moveItems-id-1',
        permanentLocationId: 2
      },
      {
        id: 'moveItems-id-2',
        permanentLocationId: 3
      },
    ],
  }),
  useInstanceHoldingsQuery: jest.fn().mockReturnValue(
    {
      holdingsRecords: [
        {
          leftHoldings: {
            id: 'moveItems-id-2',
          }
        }
      ]
    }
  ).mockReturnValueOnce(
    {
      holdingsRecords: [
          {
          rightHoldings: {
            id: 'moveItems-id-1',
          }
        }
      ]
    }
  )
}));

const queryClient = new QueryClient();
const history = createMemoryHistory();
const leftInstance= {
  id: 'moveItems-id-1',
  title: 'LeftInstance Title',
};
const rightInstance= {
  id: 'moveItems-id-2',
  title: 'RightInstance Title'
};
const mockedMoveItems = jest.fn().mockResolvedValue({});

const Child = () => {
  return (
    <div>
      <span>MoveItemsContext</span>
    </div>
  );
};

const renderMoveItemsContext = () => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <Router history={history}>
      <DataContext.Provider value={{ locationsById: {} }}>
        <MoveItemsContext
          leftInstance={leftInstance}
          rightInstance={rightInstance}
          moveItems={mockedMoveItems}
        >
          <Child />
        </MoveItemsContext>
      </DataContext.Provider>
    </Router>
  </QueryClientProvider>,
  translationsProperties
);

describe('MoveItemsContext', () => {
  beforeEach(() => {
    cleanup();
  });
  it('MoveItemsContext should render correctly', () => {
    renderMoveItemsContext();
    expect(screen.getByText('MoveItemsContext')).toBeInTheDocument();
  });
  it('Confirmation Model should render', () => {
    renderMoveItemsContext();
    expect(screen.getByText('ConfirmationModal')).toBeInTheDocument();
  });
  it('MoveItems to be called when onDragStart', () => {
    renderMoveItemsContext();
    userEvent.click(screen.getByRole('button', { name: 'onDragStart'}));
    userEvent.click(screen.getByRole('button', { name: 'onDragEnd'}));
  });
});
