import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  fireEvent,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  translationsProperties,
);

const checkFieldInTheDocument = ({ role, fieldName }) => {
  expect(screen.getByRole(role, { name: fieldName })).toBeInTheDocument();
};

describe('InstanceForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form', () => {
    renderInstanceForm();

    expect(screen.getByRole('form', { name: /instance form/i })).toBeInTheDocument();
  });

  describe('header', () => {
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

  describe('subheader', () => {
    it('should render hrid and last update date', async () => {
      const { findByText } = renderInstanceForm();

      const subheader = await findByText('test hrid • Last updated: 4/11/2019');

      expect(subheader).toBeInTheDocument();
    });
  });

  it('should render correct accordions', () => {
    renderInstanceForm();

    expect(screen.getByRole('button', { name: 'Administrative data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Title data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Identifier' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contributor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Descriptive data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Instance notes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Electronic access' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subject' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Classification' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Instance relationship' })).toBeInTheDocument();
  });

  describe('"Administrative data" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'checkbox', fieldName: /set for deletion/i },
        { role: 'checkbox', fieldName: /suppress from discovery/i },
        { role: 'checkbox', fieldName: /staff suppress/i },
        { role: 'checkbox', fieldName: /previously held/i },
        { role: 'textbox', fieldName: /instance hrid/i },
        { role: 'textbox', fieldName: 'Source' },
        { role: 'textbox', fieldName: /cataloged date/i },
        { role: 'combobox', fieldName: /instance status term/i },
        { role: 'combobox', fieldName: /mode of issuance/i },
        { role: 'button', fieldName: /add statistical code/i },
        { role: 'button', fieldName: /add administrative note/i },
      ].forEach(checkFieldInTheDocument);
    });

    describe('when "Set for deletion" checkbox is checked', () => {
      beforeEach(async () => {
        renderInstanceForm();

        const setForDeletion = screen.getByRole('checkbox', { name: /set for deletion/i });

        await waitFor(() => userEvent.click(setForDeletion));
      });

      it('"Suppress from discovery" and "Staff suppress" checkboxes should be disabled', () => {
        expect(screen.getByRole('checkbox', { name: /suppress from discovery/i })).toHaveAttribute('disabled');
        expect(screen.getByRole('checkbox', { name: /staff suppress/i })).toHaveAttribute('disabled');
      });

      it('and checked', () => {
        expect(screen.getByRole('checkbox', { name: /suppress from discovery/i }).checked).toBe(true);
        expect(screen.getByRole('checkbox', { name: /staff suppress/i }).checked).toBe(true);
      });
    });
  });

  describe('"Title data" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'textbox', fieldName: /resource title/i },
        { role: 'button', fieldName: /add alternative title/i },
        { role: 'textbox', fieldName: /index title/i },
        { role: 'button', fieldName: /add series/i },
        { role: 'button', fieldName: /add preceding title/i },
        { role: 'button', fieldName: /add succeeding title/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Identifier" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add identifier/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Contributor" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add contributor/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Descriptive data" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add publication/i },
        { role: 'button', fieldName: /add edition/i },
        { role: 'button', fieldName: /add description/i },
        { role: 'combobox', fieldName: /resource type/i },
        { role: 'button', fieldName: /add nature of content/i },
        { role: 'button', fieldName: /add format/i },
        { role: 'button', fieldName: /add language/i },
        { role: 'button', fieldName: /add frequency/i },
        { role: 'button', fieldName: /add range/i },
        { role: 'combobox', fieldName: /date type/i },
        { role: 'textbox', fieldName: /date 1/i },
        { role: 'textbox', fieldName: /date 2/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Instance notes" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add note/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Electronic access" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add electronic access/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Subject" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add subject/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Classification" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add classification/i },
      ].forEach(checkFieldInTheDocument);
    });
  });

  describe('"Instance relationship" accordion', () => {
    it('should have correct fields', () => {
      renderInstanceForm();

      [
        { role: 'button', fieldName: /add child instance/i },
        { role: 'button', fieldName: /add parent instance/i },
      ].forEach(checkFieldInTheDocument);
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
