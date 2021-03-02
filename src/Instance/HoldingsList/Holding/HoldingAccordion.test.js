import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import DataContext from '../../../contexts/DataContext';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import { items as itemsFixture } from '../../../../test/fixtures/items';
import HoldingAccordion from './HoldingAccordion';

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};

const HoldingAccordionSetup = ({
  items = itemsFixture,
} = {}) => (
  <Router>
    <DataContext.Provider value={{ locationsById: {} }}>
      <StripesContext.Provider value={stripesStub}>
        <HoldingAccordion
          holding={{ id: '123' }}
          holdings={[]}
          onViewHolding={noop}
          onAddItem={noop}
          withMoveDropdown={false}
          mutator={{
            instanceHoldingItems: {
              GET: () => new Promise(resolve => resolve(items)),
              reset: noop,
            },
          }}
        >
          {() => null}
        </HoldingAccordion>
      </StripesContext.Provider>
    </DataContext.Provider>
  </Router>
);

describe('HoldingAccordion', () => {
  beforeEach(async () => {
    await act(async () => {
      await renderWithIntl(<HoldingAccordionSetup />, translations);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render items counter', () => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  describe('opening accordion', () => {
    beforeEach(() => {
      userEvent.click(screen.getByText(/Holdings:/));
    });

    it('should hide item counter', async () => {
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
  });
});
