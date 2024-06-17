import { IntlProvider } from 'react-intl';

import {
  render,
  cleanup,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  ConfirmationModal,
} from '@folio/stripes/components';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  useBoundPieces,
  usePiecesMutation,
} from '../../common/hooks';

import BoundPiecesList from './BoundPiecesList';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(),
  TextLink: jest.fn().mockImplementation(({ children, to }) => <a href={to} data-testid="textLink">{children}</a>),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({ hasPerm: jest.fn().mockReturnValue(true) }),
}));
jest.mock('../../common/hooks', () => ({
  useBoundPieces: jest.fn(),
  usePiecesMutation: jest.fn(),
}));

const boundPieces = [{
  isBound: true,
  displaySummary: 'Electronic item',
  status: { name: 'Available' },
  itemId: 'itemId',
  id: 'id',
}];

const mockUnboundPiece = jest.fn().mockResolvedValue(() => Promise.resolve());

const renderBoundPiecesList = (props = {}) => (render(
  <IntlProvider locale="en">
    <BoundPiecesList
      id="boundPiecesListId"
      itemId={boundPieces[0].itemId}
      {...props}
    />
  </IntlProvider>,
));

describe('BoundPiecesList', () => {
  beforeEach(() => {
    useBoundPieces.mockClear().mockReturnValue({
      boundPieces,
      totalCount: boundPieces.length,
      isFetching: false,
    });
    usePiecesMutation.mockClear().mockReturnValue({
      unboundPiece: mockUnboundPiece,
      isLoading: false,
    });
  });

  afterEach(cleanup);

  it('should render component', () => {
    renderBoundPiecesList();

    expect(screen.getByText('ui-receiving.piece.displaySummary')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
  });

  it('should render barcode link', () => {
    useBoundPieces.mockClear().mockReturnValue({
      boundPieces: [{
        ...boundPieces[0],
        barcode: 'barcode',
        titleId: 'titleId',
      }],
      totalCount: boundPieces.length,
      isFetching: false,
    });

    renderBoundPiecesList();

    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByTestId('textLink')).toBeInTheDocument();
  });

  it('should call `unboundPiece` mutation on click remove button', async () => {
    useBoundPieces.mockClear().mockReturnValue({
      boundPieces: [{
        ...boundPieces[0],
        barcode: 'barcode',
      }],
      totalCount: boundPieces.length,
      isFetching: false,
    });

    renderBoundPiecesList();

    await userEvent.click(screen.getByRole('button'));

    ConfirmationModal.mock.calls[0][0].onConfirm();
    expect(mockUnboundPiece).toHaveBeenCalled();
  });

  it('should not render component when pieces are not fetched', () => {
    useBoundPieces.mockReturnValue({
      boundPieces: [],
      totalCount: 0,
      isFetching: false,
    });

    renderBoundPiecesList();

    expect(screen.queryByText('ui-receiving.piece.displaySummary')).not.toBeInTheDocument();
  });
});
