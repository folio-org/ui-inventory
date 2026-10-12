import { screen } from '@folio/jest-config-stripes/testing-library/react';
import '../../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';

import ModalHoldingsList from './ModalHoldingsList';

jest.mock('../HoldingsList/Holding/HoldingAccordionLabel', () => () => (<div>HoldingAccordionLabel</div>));

jest.mock('../../hooks/useHoldingItemsQuery', () => jest.fn(() => ({
  items: [],
  isFetching: false,
})));

jest.mock('../../hooks/useReferenceData', () => jest.fn(() => ({
  locationsById: {},
})));

jest.mock('../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings', () => jest.fn(() => ({
  boundWithHoldings: [],
  isLoading: false,
})));

jest.mock('@folio/stripes/components', () => {
  const actual = jest.requireActual('@folio/stripes/components');
  return {
    ...actual,
    Accordion: ({ id, label, children }) => (
      <div data-testid={`accordion-${id}`}>
        <div>{label}</div>
        {/* force open=true for children function */}
        {typeof children === 'function' ? children(true) : children}
      </div>
    ),
    MultiColumnList: ({ id }) => (
      <div data-testid={`mcl-${id}`} />
    ),
  };
});

const renderModalHoldingsList = (props = {}) => renderWithIntl(
  <ModalHoldingsList {...props} />,
  translationsProperties,
);

describe('ModalHoldingsList', () => {
  const holdings = [
    { id: 'h1', permanentLocationId: 'loc1' },
    { id: 'h2', permanentLocationId: 'loc2' },
  ];

  it('renders an accordion per holding', () => {
    renderModalHoldingsList({ holdings, instanceId: 'inst-1' });

    expect(screen.getByTestId('accordion-h1-accordion')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-h2-accordion')).toBeInTheDocument();
  });

  it('renders an items list for each holding', () => {
    renderModalHoldingsList({ holdings, instanceId: 'inst-1' });

    expect(screen.getByTestId('mcl-modal-list-items-h1')).toBeInTheDocument();
    expect(screen.getByTestId('mcl-modal-list-items-h2')).toBeInTheDocument();
  });
});


