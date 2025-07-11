import keyBy from 'lodash/keyBy';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  act,
  configure,
  fireEvent,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { within } from '@folio/jest-config-stripes/testing-library/dom';
import { useLocationsQuery } from '@folio/stripes-inventory-components';
import { useOkapiKy } from '@folio/stripes/core';

import {
  holdingsById,
  identifierTypes,
  instanceRelationshipTypes
} from '../../../test/fixtures';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import {
  leftInstance,
  rightInstance
} from '../../../test/fixtures/movingInstances';
import { locationsById } from '../../../test/fixtures/locationsById';
import { DataContext } from '../../contexts';
import {
  useHoldings,
  useInstanceHoldingsQuery
} from '../../providers';
import { InstanceMovementDetailsContainer } from '../InstanceMovement';
import MoveHoldingContext from './MoveHoldingContext';

configure({ testIdAttribute: 'id' });

jest.mock('../../providers', () => ({
  ...jest.requireActual('../../providers'),
  useHoldings: jest.fn(),
  useInstanceHoldingsQuery: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useHoldingItemsQuery: jest.fn().mockImplementation(() => ({
    totalRecords: 1,
    isLoading: false,
    isFetching: false,
  })),
}));

useHoldings.mockImplementation(() => ({
  holdingsById,
}));

useInstanceHoldingsQuery.mockImplementation((id) => ({
  holdingsRecords: Object.values(holdingsById).filter(holding => holding.instanceId === id),
  isLoading: false,
  refetch: jest.fn(),
}));

useLocationsQuery.mockImplementation(() => ({
  locations: Object.values(locationsById)
}));

const onClose = jest.fn();
const moveHoldings = jest.fn().mockImplementation(() => Promise.resolve());

const renderMoveHoldingContext = () => renderWithIntl(
  <Router>
    <DataContext.Provider value={{
      contributorTypes: [],
      identifierTypes,
      identifierTypesById: keyBy(identifierTypes, 'id'),
      identifierTypesByName: keyBy(identifierTypes, 'name'),
      instanceRelationshipTypes,
      instanceRelationshipTypesById: keyBy(identifierTypes, 'id'),
      instanceFormats: [],
      modesOfIssuance: [],
      natureOfContentTerms: [],
      tagsRecords: [],
      locationsById,
    }}
    >
      <MoveHoldingContext
        leftInstance={leftInstance}
        rightInstance={rightInstance}
        moveHoldings={moveHoldings}
      >
        <InstanceMovementDetailsContainer
          instance={leftInstance}
          onClose={onClose}
          refetch={() => leftInstance}
          data-test-movement-from-instance-details
          id="movement-from-instance-details"
        />

        <InstanceMovementDetailsContainer
          instance={rightInstance}
          onClose={onClose}
          refetch={() => rightInstance}
          data-test-movement-to-instance-details
          id="movement-to-instance-details"
        />
      </MoveHoldingContext>
    </DataContext.Provider>
  </Router>,
  translationsProperties
);


describe('MoveHoldingContext', () => {
  it('should render correct holdings accordion for left pane', () => {
    const { getByTestId } = renderMoveHoldingContext();

    const leftPane = getByTestId('movement-from-instance-details');
    expect(within(leftPane).getByText(/Holdings: Main Library/)).toBeInTheDocument();
    expect(within(leftPane).getByText(/Holdings: Annex/)).toBeInTheDocument();
  });

  it('should render "Drop holding" area in right pane', () => {
    const { getByTestId } = renderMoveHoldingContext();

    const leftPane = getByTestId('movement-to-instance-details');
    expect(within(leftPane).getByText(/Drop holding/)).toBeInTheDocument();
  });

  it('"Select holdings" checkbox functionality works as expected', () => {
    const { getByTestId } = renderMoveHoldingContext();

    const selectHoldingCheckbox = getByTestId('select-holding-c4a15834-0184-4a6f-9c0c-0ca5bad8286d');

    fireEvent.click(selectHoldingCheckbox);
    expect(selectHoldingCheckbox).toBeChecked();

    fireEvent.click(selectHoldingCheckbox);
    expect(selectHoldingCheckbox).not.toBeChecked();
  });

  it('should render confirmation modal with initial state in background', () => {
    const { getByText } = renderMoveHoldingContext();

    expect(getByText(/ConfirmationModal/)).toBeInTheDocument();
    expect(getByText(/0 items will be moved to/)).toBeInTheDocument();
  });

  it('should render correct list of holdings for Annex with checkbox', async () => {
    const { getByTestId } = renderMoveHoldingContext();

    const annexSection = getByTestId('c4a15834-0184-4a6f-9c0c-0ca5bad8286d');
    const annexHoldingsAccordionBtn = getByTestId('accordion-toggle-button-c4a15834-0184-4a6f-9c0c-0ca5bad8286d');

    fireEvent.click(annexHoldingsAccordionBtn);

    let grid;
    let rows;

    await waitFor(() => {
      grid = within(annexSection).getByRole('grid');
      rows = within(grid).getAllByRole('row');

      expect(grid).toBeVisible();
      expect(rows).toHaveLength(3);

      // render correct table headers
      const titles = [
        'Item: barcode',
        'Status',
        'Copy number',
        'Loan type',
        'Effective location',
        'Enumeration',
        'Chronology',
        'Volume',
        'Year, caption',
        'Material type'
      ];

      titles.forEach(title => {
        expect(within(rows[0]).getByText(title)).toBeInTheDocument();
      });

      // second row should have 'Inactive' cell
      expect(within(rows[1]).getByText('Inactive')).toBeInTheDocument();

      // should render 'End of list' indicator
      expect(within(grid).getByText('End of list')).toBeInTheDocument();
    });

    fireEvent.click(within(rows[1]).getByRole('checkbox'));

    rows.forEach(row => {
      expect(within(row).getByRole('checkbox')).toBeChecked();
    });

    fireEvent.click(within(rows[1]).getByRole('checkbox'));

    rows.forEach(row => {
      expect(within(row).getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('when "Move" button is clicked', () => {
    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue({
        get: () => ({
          json: () => ({
            poLines: [{
              locations: [
                { locationId: '53cf956f-c1df-410b-8bea-27f712cca7c0' },
                { locationId: '53cf956f-c1df-410b-8bea-27f712cca7c0' },
              ],
            }],
          }),
        }),
      });
    });

    const clickMoveFlow = async ({ getByTestId, findByText }) => {
      const holdingsAnnex = getByTestId('item-row-c4a15834-0184-4a6f-9c0c-0ca5bad8286d');

      const moveToBtn = within(holdingsAnnex).getByText('Move to');

      fireEvent.click(moveToBtn);

      const dropdownMoveBtn = within(holdingsAnnex).getByText('A journey through Europe Bildtontraeger high-speed lines European Commission, Directorate-General for Mobility and Transport');
      expect(dropdownMoveBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(dropdownMoveBtn);
      });

      expect(await findByText(/This holdings is linked to a purchase order line/)).toBeInTheDocument();
    };

    it('should move selected holdings if "Confirm button" is clicked', async () => {
      const { findByText, getByTestId } = renderMoveHoldingContext();

      await clickMoveFlow({ findByText, getByTestId });

      const confirmBtn = screen.getByRole('button', { name: /confirm/ });

      fireEvent.click(confirmBtn);

      expect(screen.queryByText('Loading')).toBeInTheDocument();
    });

    it('should close modal and stop moving when "Cancel" is clicked', async () => {
      const { findByText, getByTestId } = renderMoveHoldingContext();

      await clickMoveFlow({ findByText, getByTestId });

      const cancelBtn = screen.getByRole('button', { name: /cancel/ });

      fireEvent.click(cancelBtn);

      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
  });
});
