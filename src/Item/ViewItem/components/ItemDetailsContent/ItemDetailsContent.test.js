import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemDetailsContent from './ItemDetailsContent';
import useItemDetailsData from '../../../hooks/useItemDetailsData';

jest.mock('../../../hooks/useItemDetailsData', () => jest.fn());

const mockItem = {
  id: 'itemId',
  status: { name: 'Available' },
  tags: {
    tagList: ['tag1', 'tag2'],
  },
};

const mockInstance = {
  id: 'instanceId',
  title: 'Test Instance',
};

const mockHoldings = {
  id: 'holdingsId',
  permanentLocationId: 'permanentLocationId',
  temporaryLocationId: 'temporaryLocationId',
};

const mockReferenceTables = {
  locationsById: {
    permanentLocationId: {
      name: 'Permanent Location',
      isActive: true,
    },
    temporaryLocationId: {
      name: 'Temporary Location',
      isActive: false,
    },
  },
  electronicAccessRelationships: [],
};

const mockItemDetailsData = {
  itemLocation: {
    effectiveLocation: {
      name: 'Effective Location',
      isActive: true,
    },
    permanentLocation: {},
  },
  administrativeData: {},
  itemData: {},
  enumerationData: {},
  condition: {},
  loanAndAvailability: {},
  electronicAccess: { electronicAccess: [] },
  circulationHistory: {},
  boundWithTitles: [],
  initialAccordionsState: {},
};

const defaultProps = {
  item: mockItem,
  instance: mockInstance,
  holdings: mockHoldings,
  referenceTables: mockReferenceTables,
  accordionStatusRef: { current: null },
  refLookup: jest.fn(),
  isTagsEnabled: true,
  requestCount: 0,
  requestsUrl: 'requests/url',
};

const renderItemDetailsContent = async (props = {}) => {
  let renderResult;
  await act(async () => {
    renderResult = renderWithIntl(
      <MemoryRouter>
        <ItemDetailsContent
          {...defaultProps}
          {...props}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });
  return renderResult;
};

describe('ItemDetailsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useItemDetailsData.mockReturnValue(mockItemDetailsData);
  });

  it('should render with no axe errors', async () => {
    const { container } = await renderItemDetailsContent();
    await runAxeTest({ rootNode: container });
  });

  it('should render effective location', async () => {
    await renderItemDetailsContent();
    const effectiveLocation = screen.getByTestId('item-effective-location');
    expect(within(effectiveLocation).getByText('Effective Location')).toBeInTheDocument();
  });

  it('should render discovery suppress warning when item is suppressed', async () => {
    const suppressedItem = {
      ...mockItem,
      discoverySuppress: true,
    };
    await renderItemDetailsContent({ item: suppressedItem });
    expect(screen.getByText('Warning: Item is marked suppressed from discovery')).toBeInTheDocument();
  });

  it('should not render discovery suppress warning when item is not suppressed', async () => {
    await renderItemDetailsContent();
    expect(screen.queryByText('Warning: Item is marked suppressed from discovery')).not.toBeInTheDocument();
  });

  it('should render tags accordion when tags are enabled', async () => {
    await renderItemDetailsContent();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should not render tags accordion when tags are disabled', async () => {
    await renderItemDetailsContent({ isTagsEnabled: false });
    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  it('should render item acquisition section when purchase order line identifier exists', async () => {
    const itemWithPO = {
      ...mockItem,
      purchaseOrderLineIdentifier: '123',
    };
    await renderItemDetailsContent({ item: itemWithPO });
    expect(screen.getByText('Acquisition')).toBeInTheDocument();
  });

  it('should not render item acquisition section when purchase order line identifier does not exist', async () => {
    await renderItemDetailsContent();
    expect(screen.queryByText('Acquisition')).not.toBeInTheDocument();
  });

  it('should render all required sections', async () => {
    await renderItemDetailsContent();
    expect(screen.getByText('Administrative data')).toBeInTheDocument();
    expect(screen.getByText('Item data')).toBeInTheDocument();
    expect(screen.getByText('Enumeration data')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Item notes')).toBeInTheDocument();
    expect(screen.getByText('Loan and availability')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Electronic access')).toBeInTheDocument();
    expect(screen.getByText('Circulation history')).toBeInTheDocument();
    expect(screen.getByText('Bound-with and analytics')).toBeInTheDocument();
    expect(screen.getByText('Bound pieces data')).toBeInTheDocument();
  });
});
