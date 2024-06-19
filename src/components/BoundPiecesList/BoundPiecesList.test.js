import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { ConfirmationModal } from '@folio/stripes/components';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
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

const mockUpdatePiece = jest.fn().mockResolvedValue(() => Promise.resolve());

const renderBoundPiecesList = (props = {}) => renderWithIntl(
  <BoundPiecesList
    id="boundPiecesListId"
    itemId={boundPieces[0].itemId}
    {...props}
  />,
  translationsProperties
);

describe('BoundPiecesList', () => {
  beforeEach(() => {
    useBoundPieces.mockClear().mockReturnValue({
      boundPieces,
      totalCount: boundPieces.length,
      isFetching: false,
    });
    usePiecesMutation.mockClear().mockReturnValue({
      updatePiece: mockUpdatePiece,
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderBoundPiecesList();

    expect(screen.getByText('ui-inventory.displaySummary')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.barcode')).toBeInTheDocument();
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

    expect(screen.getByText('ui-inventory.barcode')).toBeInTheDocument();
    expect(screen.getByTestId('textLink')).toBeInTheDocument();
  });

  it('should call `updatePiece` mutation on click remove button', async () => {
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
    expect(mockUpdatePiece).toHaveBeenCalled();
  });

  it('should not render component when pieces are not fetched', () => {
    useBoundPieces.mockReturnValue({
      boundPieces: [],
      totalCount: 0,
      isFetching: false,
    });

    renderBoundPiecesList();

    expect(screen.queryByText('ui-inventory.displaySummary')).not.toBeInTheDocument();
  });
});
