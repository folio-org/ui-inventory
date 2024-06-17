import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import { useLocationsQuery } from '@folio/stripes-inventory-components';
import { screen, waitFor, fireEvent, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import { items as itemsFixture } from '../../../../test/fixtures/items';
import { useHoldingItemsQuery } from '../../../hooks';

import HoldingAccordion from './HoldingAccordion';

jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn());
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useHoldingItemsQuery: jest.fn(),
}));

useLocationsQuery.mockReturnValue({
  locations: [
    {
      id: 'inactiveLocation',
      name: 'Location 1',
      isActive: false,
    },
  ],
});

const HoldingAccordionSetup = () => (
  <Router>
    <HoldingAccordion
      holding={{
        id: '123',
        permanentLocation: { id: 'inactiveLocation' },
      }}
      holdings={[]}
      onViewHolding={noop}
      onAddItem={noop}
      withMoveDropdown={false}
      instanceId="instanceId"
      pathToAccordionsState={['holdings']}
    >
      <></>
    </HoldingAccordion>
  </Router>
);

describe('HoldingAccordion', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: false,
      totalRecords: itemsFixture.length,
    });

    await act(async () => {
      await renderWithIntl(<HoldingAccordionSetup />, translations);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display "inactive" if applicable in the accordion header', async () => {
    await waitFor(() => {
      const accordionSection = document.querySelector('*[data-test-accordion-section=true]').innerHTML;
      expect(accordionSection).toContain('Inactive');
    });
  });

  it('should render closed holdings accordion by default', () => {
    expect(screen.getByRole('button', { name: /holdings: inactive >/i, expanded: false })).toBeInTheDocument();
  });

  it('should render items counter', () => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  describe('opening accordion', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText(/Holdings:/));
    });

    it('should hide item counter', async () => {
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
  });
});
