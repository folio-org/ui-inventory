import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { fireEvent, screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../test/jest/helpers';
import { DataContext } from '../contexts';

import InstanceForm from './InstanceForm';

const mockInitialValues = {
  title: 'test title',
  instanceTypeId: '',
  instanceFormatId: 'instanceFormatId',
  statisticalCodeId: 'statisticalCodeId',
  instanceSource: 'MARC',
  alternativeTitles: [''],
  publication: [{ publisher: '', dateOfPublication: '', place: '' }],
  languages: [''],
  source: 'MARC',
  id: 'testId',
  metadata: { updatedDate: '2019-04-11T12:01:48.451+0000' },
  hrid: 'test hrid',
  tenantId: 'tenantId',
  shared: 'false',
};

const mockReferenceTables = {
  instanceTypes: [{ id: 'instanceTypesId', name: 'instanceTypesId' }],
  instanceStatuses: [],
  modesOfIssuance: [{ id: 'modesOfIssuanceId', name: 'modesOfIssuanceId' }],
  statisticalCodes: [{
    id: 'testId1',
    statisticalCodeTypeId: 'testStatisticalCodeTypeId1',
    code: 'testCode1',
    name: 'testName1',
  }, {
    id: 'testId2',
    statisticalCodeTypeId: 'testStatisticalCodeTypeId2',
    code: 'testCode2',
    name: 'testName2',
  }],
  instanceRelationshipTypes: [{ id: 'instanceRelationshipTypesId', name: 'instanceRelationshipTypesId' }],
  alternativeTitleTypes: [{ id: 'alternativeTitleTypesId', name: 'statisticalCodeId', code: 'alternativeTitleTypescode' }],
  identifierTypes: [],
  contributorNameTypes: [],
  contributorTypes: [],
  natureOfContentTerms: [],
  instanceFormats: [],
  instanceNoteTypes: [],
  electronicAccessRelationships: [],
  classificationTypes: [],
  subjectSources: [],
  subjectTypes: [],
};

const mockBlockedFields = [
  'shelvingTitle',
];

const mockResources = {
  instanceBlockedFields: {
    hasLoaded: true,
    records: [{
      blockedFields: mockBlockedFields,
    }],
  },
};

const mockItemCount = 0;
const mockGoTo = jest.fn();

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockInstance = jest.fn();
const mockSetKeepEditing = jest.fn();

const queryClient = new QueryClient();

const InstanceFormSetUp = (props = {}) => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={{
        contributorTypes: [],
        instanceFormats: [],
        modesOfIssuance: [],
        natureOfContentTerms: [],
        tagsRecords: [],
      }}
      >
        <InstanceForm
          initialValues={mockInitialValues}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          instance={mockInstance}
          referenceTables={mockReferenceTables}
          itemCount={mockItemCount}
          goTo={mockGoTo}
          isMARCRecord
          resources={mockResources}
          setKeepEditing={mockSetKeepEditing}
          {...props}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  </Router>
);

const defaultprops = {
  onCancel: jest.fn(),
  handleSubmit: jest.fn(),
  pristine: 'false',
  submitting: 'false',
  history: {},
  httpError: {},
  id: 'InstanceForm Id'
};

const renderInstanceForm = (props = {}) => renderWithIntl(
  <InstanceFormSetUp {...props} {...defaultprops} />,
  translationsProperties
);

describe('InstanceForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form', () => {
    const { container } = renderInstanceForm();
    expect(container.querySelectorAll('form').length).toEqual(1);
  });

  describe('render component function', () => {
    it('components should render correctly', () => {
      renderInstanceForm();
      expect(screen.getByRole('group', { name: 'Alternative titles' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Series statements' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Preceding titles' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Succeeding titles' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Identifiers' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Contributors' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Publications' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Editions' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Physical descriptions' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Nature of content' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Formats' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Languages' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Publication frequency' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Publication range' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Notes' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Electronic access' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Classification' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Child instances' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Parent instances' })).toBeInTheDocument();
    });
  });

  describe('Instance form header', () => {
    describe('when user is central tenant', () => {
      it('should render correct title', async () => {
        const { findByText } = renderInstanceForm({
          stripes: {
            ...stripesStub,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          },
          initialValues: {
            ...mockInitialValues,
            tenantId: 'consortium',
            shared: true,
          },
        });

        const title = await findByText('Edit shared instance • test title');

        expect(title).toBeInTheDocument();
      });
    });

    describe('when user is member library tenant', () => {
      it('should render correct title', async () => {
        const { findByText } = renderInstanceForm({
          stripes: {
            ...stripesStub,
            okapi: { tenant: 'university' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          },
          initialValues: {
            ...mockInitialValues,
            tenantId: 'university',
            shared: false,
          },
        });

        const title = await findByText('Edit local instance • test title');

        expect(title).toBeInTheDocument();
      });
    });

    describe('when user is non-consortial tenant', () => {
      it('should render correct title', async () => {
        const { findByText } = renderInstanceForm({
          stripes: {
            ...stripesStub,
            hasInterface: () => false,
          },
        });

        const title = await findByText('Edit instance • test title');

        expect(title).toBeInTheDocument();
      });
    });
  });

  describe('Instance subheader', () => {
    it('should render hrid and last update date', async () => {
      const { findByText } = renderInstanceForm();

      const subheader = await findByText('test hrid • Last updated: 4/11/2019');

      expect(subheader).toBeInTheDocument();
    });
  });

  it('should render Save & keep editing and Save & close buttons', () => {
    const { getByRole } = renderInstanceForm({
      showKeepEditingButton: true,
    });

    expect(getByRole('button', { name: 'Save & keep editing' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save & close' })).toBeInTheDocument();
  });

  describe('when clicking Save & close', () => {
    it('should call setKeepEditing with false', () => {
      const { getByRole } = renderInstanceForm();

      fireEvent.change(getByRole('textbox', { name: 'Resource title' }), { target: { value: 'new title' } });
      fireEvent.click(getByRole('button', { name: 'Save & close' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(false);
    });
  });

  describe('when clicking Save & keep editing', () => {
    it('should call setKeepEditing with true', () => {
      const { getByRole } = renderInstanceForm({
        showKeepEditingButton: true,
      });

      fireEvent.change(getByRole('textbox', { name: 'Resource title' }), { target: { value: 'new title' } });
      fireEvent.click(getByRole('button', { name: 'Save & keep editing' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(true);
    });
  });
});
