import React, { act } from 'react';
import '../../../test/jest/__mock__';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  screen,
  fireEvent,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataContext } from '../../contexts';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import InstanceDetails from './InstanceDetails';

jest.mock('../../components/ViewSource/ViewSource', () => jest.fn().mockReturnValue('ViewSource'));
jest.mock('../InstanceDetails/InstanceTitle/InstanceTitle', () => jest.fn().mockReturnValue('InstanceTitle'));
jest.mock('../InstanceDetails/InstanceContributorsView/InstanceContributorsView', () => jest.fn().mockReturnValue('InstanceContributorsView'));
jest.mock('../InstanceDetails/InstanceSubjectView/InstanceSubjectView', () => jest.fn().mockReturnValue('InstanceSubjectView'));
jest.mock('../InstanceDetails/InstanceTitleData/AlternativeTitlesList', () => jest.fn().mockReturnValue('AlternativeTitlesList'));
jest.mock('../InstanceDetails/InstanceTitleData/TitleSeriesStatements', () => jest.fn().mockReturnValue('TitleSeriesStatements'));
jest.mock('../InstanceDetails/ControllableDetail/ControllableDetail', () => jest.fn().mockReturnValue('ControllableDetail'));
jest.mock('../InstanceDetails/SubInstanceGroup/SubInstanceGroup', () => jest.fn().mockReturnValue('SubInstanceGroup'));
jest.mock('../InstanceDetails/InstanceAcquisition/InstanceAcquisition', () => jest.fn().mockReturnValue('InstanceAcquisition'));
jest.mock('../InstanceDetails/InstanceTitleData/InstanceTitleData', () => jest.fn().mockReturnValue('InstanceTitleData'));
jest.mock('../HoldingsList/consortium/ConsortialHoldings', () => ({
  ...jest.requireActual('../HoldingsList/consortium/ConsortialHoldings'),
  ConsortialHoldings: () => <button type="button">Consortial holdings</button>,
}));

const instance = {
  title: 'Test Title',
  source: 'FOLIO',
  contributors: [],
  identifiers: [],
  instanceTypeId: '1234',
  instanceFormatIds: [],
  physicalDescriptions: [],
  languages: [],
  publication: [],
  notes: [],
  staffSuppress: false,
  discoverySuppress: false,
  deleted: false,
  shared: false,
};

const mockReferenceData = {
  titleTypes:[
    { id: '1', name: 'Type 1' },
    { id: '2', name: 'Type 2' },
  ],
  instanceTypes: [
    { id: '1', name: 'Book' },
    { id: '2', name: 'E-book' },
  ]
};

const queryClient = new QueryClient();

const actionMenu = jest.fn();
const onClose = jest.fn();
const tagsEnabled = true;

const renderInstanceDetails = (props) => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <MemoryRouter>
          <InstanceDetails
            instance={instance}
            onClose={onClose}
            tagsEnabled={tagsEnabled}
            actionMenu={actionMenu}
            {...props}
          />
        </MemoryRouter>
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceDetails', () => {
  it('renders the InstanceDetails component', () => {
    renderInstanceDetails();

    expect(screen.getByText('InstanceTitle')).toBeInTheDocument();
    expect(screen.getByText('Add holdings')).toBeInTheDocument();
    expect(screen.getByText('Administrative data')).toBeInTheDocument();
    expect(screen.getByText('Instance HRID')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Cataloged date')).toBeInTheDocument();
    expect(screen.getByText('Instance status term')).toBeInTheDocument();
    expect(screen.getByText('status updated -')).toBeInTheDocument();
    expect(screen.getByText('Instance status code')).toBeInTheDocument();
    expect(screen.getByText('Instance status source')).toBeInTheDocument();
    expect(screen.getByText('Mode of issuance')).toBeInTheDocument();
    expect(screen.getByText('Statistical code type')).toBeInTheDocument();
    expect(screen.getByText('Statistical code name')).toBeInTheDocument();
    expect(screen.getByText('Format category')).toBeInTheDocument();
    expect(screen.getByText('Format term')).toBeInTheDocument();
    expect(screen.getByText('Format code')).toBeInTheDocument();
    expect(screen.getByText('Format source')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Publication frequency')).toBeInTheDocument();
    expect(screen.getByText('Publication range')).toBeInTheDocument();
    expect(screen.getByText('Instance notes')).toBeInTheDocument();
    expect(screen.getByText('Staff only')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('Electronic access')).toBeInTheDocument();
    expect(screen.getByText('URL relationship')).toBeInTheDocument();
    expect(screen.getByText('URI')).toBeInTheDocument();
    expect(screen.getByText('Link text')).toBeInTheDocument();
    expect(screen.getByText('Materials specified')).toBeInTheDocument();
    expect(screen.getByText('URL public note')).toBeInTheDocument();
    expect(screen.getByText('Classification identifier type')).toBeInTheDocument();
    expect(screen.getByText('Instance relationship')).toBeInTheDocument();
  });

  it('should show a correct Warning message banner when staff suppressed', () => {
    const staffSuppressedInstance = {
      ...instance,
      staffSuppress: true,
    };
    renderInstanceDetails({ instance: staffSuppressedInstance });

    expect(screen.getByText('Warning: Instance is marked staff suppressed')).toBeInTheDocument();
    expect(screen.getByText('Staff suppressed')).toBeInTheDocument();
  });

  it('should show a correct Warning message banner when discovery suppressed', () => {
    const discoverySuppressedInstance = {
      ...instance,
      discoverySuppress: true,
    };
    renderInstanceDetails({ instance: discoverySuppressedInstance });

    expect(screen.getByText('Warning: Instance is marked suppressed from discovery')).toBeInTheDocument();
    expect(screen.getByText('Suppressed from discovery')).toBeInTheDocument();
  });
  it('should show a correct Warning message banner when both staff and discovery suppressed', () => {
    const bothSuppressedInstance = {
      ...instance,
      staffSuppress: true,
      discoverySuppress: true,
    };
    renderInstanceDetails({ instance: bothSuppressedInstance });

    expect(screen.getByText('Warning: Instance is marked suppressed from discovery and staff suppressed')).toBeInTheDocument();
  });
  it('should show a correct Warning message banner when set for deletion, staff and discovery suppressed', () => {
    const deletedAndBothSuppressedInstance = {
      ...instance,
      staffSuppress: true,
      discoverySuppress: true,
      deleted: true,
    };
    renderInstanceDetails({ instance: deletedAndBothSuppressedInstance });

    const warningBanner = screen.getByText('Warning:', { exact: false });

    expect(warningBanner.textContent).toEqual('Warning: Instance is set for deletion, suppressed from discovery, and staff suppressed');
  });

  it('expands and collapses the accordion sections', () => {
    renderInstanceDetails();

    const expandAllButtons = screen.getByText('Expand all');
    const firstAccordionSection = screen.getByRole('button', { name: /Administrative data/i });
    const secondAccordionSection = screen.getByRole('button', { name: /Instance notes/i });
    const thirdAccordionSection = screen.getByRole('button', { name: /Electronic access/i });
    const fourthAccordionSection = screen.getByRole('button', { name: /Classification/i });
    // Administrative data is open because it has initial data inside it
    expect(firstAccordionSection.getAttribute('aria-expanded')).toBe('true');
    expect(secondAccordionSection.getAttribute('aria-expanded')).toBe('false');
    expect(thirdAccordionSection.getAttribute('aria-expanded')).toBe('false');
    expect(fourthAccordionSection.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(expandAllButtons);
    expect(firstAccordionSection.getAttribute('aria-expanded')).toBe('true');
    expect(secondAccordionSection.getAttribute('aria-expanded')).toBe('true');
    expect(thirdAccordionSection.getAttribute('aria-expanded')).toBe('true');
    expect(fourthAccordionSection.getAttribute('aria-expanded')).toBe('true');
    const collapseAllButtons = screen.getByText('Collapse all');
    fireEvent.click(collapseAllButtons);
    expect(firstAccordionSection.getAttribute('aria-expanded')).toBe('false');
    expect(secondAccordionSection.getAttribute('aria-expanded')).toBe('false');
    expect(thirdAccordionSection.getAttribute('aria-expanded')).toBe('false');
    expect(fourthAccordionSection.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders tags button if tagsEnabled is true', () => {
    renderInstanceDetails();

    const button = screen.getAllByRole('button', { id: 'clickable-show-tags' });
    fireEvent.click(button[1]);
    expect(button[1]).toBeEnabled();
  });

  describe('Consortial holdings accordion', () => {
    it('should be visible for shared instances', () => {
      const sharedInstance = {
        ...instance,
        shared: true,
      };
      renderInstanceDetails({ instance: sharedInstance });

      expect(screen.getByRole('button', { name: 'Consortial holdings' })).toBeInTheDocument();
    });

    it('should be visible for shadow instances', () => {
      const shadowInstance = {
        ...instance,
        shared: false,
        source: 'CONSORTIUM-FOLIO',
      };
      renderInstanceDetails({ instance: shadowInstance });

      expect(screen.getByRole('button', { name: 'Consortial holdings' })).toBeInTheDocument();
    });

    it('should not be visible for local instances', () => {
      renderInstanceDetails();

      expect(screen.queryByRole('button', { name: 'Consortial holdings' })).not.toBeInTheDocument();
    });
  });

  describe('Version history component', () => {
    let versionHistoryButton;

    beforeEach(async () => {
      await act(async () => { renderInstanceDetails(); });

      versionHistoryButton = screen.getByRole('button', { name: /version history/i });
    });

    it('should render version history button', async () => {
      expect(versionHistoryButton).toBeInTheDocument();
    });

    describe('when click the button', () => {
      it('should render version history pane', async () => {
        await act(() => userEvent.click(versionHistoryButton));

        expect(screen.getByRole('region', { name: /version history/i })).toBeInTheDocument();
      });
    });

    describe('when click the close button', () => {
      it('should hide the pane', async () => {
        await act(() => userEvent.click(versionHistoryButton));

        const versionHistoryPane = await screen.findByRole('region', { name: /version history/i });
        expect(versionHistoryPane).toBeInTheDocument();

        const closeButton = await within(versionHistoryPane).findByRole('button', { name: /close/i });
        await act(() => userEvent.click(closeButton));

        expect(screen.queryByRole('region', { name: /version history/i })).not.toBeInTheDocument();
      });
    });
  });
});
