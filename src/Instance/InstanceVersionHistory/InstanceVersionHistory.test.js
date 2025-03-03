import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import InstanceVersionHistory, { getFieldFormatter } from './InstanceVersionHistory';
import { DataContext } from '../../contexts';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useInstanceAuditDataQuery: () => jest.fn(),
  useInventoryVersionHistory: () => ({ versions: [], isLoadedMoreVisible: true }),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const instanceId = 'instanceId';
const mockReferenceData = {
  alternativeTitleTypes: [{ id: 'type id', name: 'type name' }],
  classificationTypes: [{ id: 'classification id', name: 'classification name' }],
  contributorNameTypes: [{ id: 'contributor id', name: 'contributor name' }],
  contributorTypes: [{ id: 'contributor type id', name: 'contributor type name' }],
  instanceDateTypes: [{ id: 'date type id', name: 'date type name' }],
  identifierTypes: [{ id: 'ident type id', name: 'ident type name' }],
  instanceFormats: [{ id: 'format id', name: 'format name' }],
  instanceNoteTypes: [{ id: 'note id', name: 'note name' }],
  instanceTypes: [{ id: 'type id', name: 'type name' }],
  modesOfIssuance: [{ id: 'mode id', name: 'mode name' }],
  natureOfContentTerms: [{ id: 'nature of content id', name: 'nature of content name' }],
  electronicAccessRelationships: [{ id: 'el access id', name: 'el access name' }],
  subjectSources: [{ id: 'subj id', name: 'subj name' }],
  statisticalCodes: [{ id: 'statistical code id', name: 'statistical code name' }],
  instanceStatuses: [{ id: 'status id', name: 'status name' }],
  subjectTypes:[{ id: 'subject type id', name: 'subject type name' }],
};

const renderInstanceVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <InstanceVersionHistory
          instanceId={instanceId}
          onClose={onCloseMock}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InstanceVersionHistory', () => {
  it('should render View history pane', () => {
    renderInstanceVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });

  describe('field formatter', () => {
    const formattedFields = getFieldFormatter(mockReferenceData);

    it('should correctly format `alternativeTitleTypeId` field value', () => {
      expect(formattedFields.alternativeTitleTypeId('type id')).toEqual('type name');
    });

    it('should correctly format `classificationTypeId` field value', () => {
      expect(formattedFields.classificationTypeId('classification id')).toEqual('classification name');
    });

    it('should correctly format `contributorTypeText` field value', () => {
      expect(formattedFields.contributorTypeText('contributor text')).toEqual('contributor text');
    });

    it('should correctly format `contributorNameTypeId` field value', () => {
      expect(formattedFields.contributorNameTypeId('contributor id')).toEqual('contributor name');
    });

    it('should correctly format `contributorTypeId` field value', () => {
      expect(formattedFields.contributorTypeId('contributor type id')).toEqual('contributor type name');
    });

    it('should correctly format `dateTypeId` field value', () => {
      expect(formattedFields.dateTypeId('date type id')).toEqual('date type name');
    });

    it('should correctly format `identifierTypeId` field value', () => {
      expect(formattedFields.identifierTypeId('ident type id')).toEqual('ident type name');
    });

    it('should correctly format `instanceFormatIds` field value', () => {
      expect(formattedFields.instanceFormatIds('format id')).toEqual('format name');
    });

    it('should correctly format `instanceNoteTypeId` field value', () => {
      expect(formattedFields.instanceNoteTypeId('note id')).toEqual('note name');
    });

    it('should correctly format `instanceTypeId` field value', () => {
      expect(formattedFields.instanceTypeId('type id')).toEqual('type name');
    });

    it('should correctly format `modeOfIssuanceId` field value', () => {
      expect(formattedFields.modeOfIssuanceId('mode id')).toEqual('mode name');
    });

    it('should correctly format `natureOfContentTermIds` field value', () => {
      expect(formattedFields.natureOfContentTermIds('nature of content id')).toEqual('nature of content name');
    });

    it('should correctly format `primary` field value', () => {
      expect(formattedFields.primary(false)).toEqual('false');
    });

    it('should correctly format `relationshipId` field value', () => {
      expect(formattedFields.relationshipId('el access id')).toEqual('el access name');
    });

    it('should correctly format `sourceId` field value', () => {
      expect(formattedFields.sourceId('subj id')).toEqual('subj name');
    });

    it('should correctly format `staffOnly` field value', () => {
      expect(formattedFields.staffOnly(true)).toEqual('true');
    });

    it('should correctly format `statisticalCodeIds` field value', () => {
      expect(formattedFields.statisticalCodeIds('statistical code id')).toEqual('statistical code name');
    });

    it('should correctly format `statusId` field value', () => {
      expect(formattedFields.statusId('status id')).toEqual('status name');
    });

    it('should correctly format `typeId` field value', () => {
      expect(formattedFields.typeId('subject type id')).toEqual('subject type name');
    });

    it('should correctly format `uri` field value', () => {
      expect(formattedFields.uri('uri')).toEqual('uri');
    });
  });
});

