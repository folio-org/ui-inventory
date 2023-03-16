import { getPublishingInfo, getAccordionState } from './utils';

jest.mock('@folio/stripes/components', () => ({
  FormattedUTCDate: jest.fn(),
}));

describe('getPublishingInfo', () => {
  it('returns expected string when publication object exists with dateOfPublication', () => {
    const instance = {
      publication: [
        {
          publisher: 'Publisher',
          dateOfPublication: '2022-01-01',
        },
      ],
    };
    expect(getPublishingInfo(instance)).toEqual('Publisher • 2022-01-01');
  });
  it('returns expected string when publication object exists without dateOfPublication', () => {
    const instance = {
      publication: [
        {
          publisher: 'Publisher',
        },
      ],
    };
    expect(getPublishingInfo(instance)).toEqual('Publisher');
  });
  it('returns undefined when publication object does not exist', () => {
    const instance = {};
    expect(getPublishingInfo(instance)).toBeUndefined();
  });
});

describe('getAccordionState', () => {
  const accordions = {
    administrative: 'Administrative',
    title: 'Title',
    identifiers: 'Identifiers',
    contributors: 'Contributors',
    descriptiveData: 'Descriptive Data',
    notes: 'Notes',
    electronicAccess: 'Electronic Access',
    subjects: 'Subjects',
    classifications: 'Classifications',
    relationship: 'Relationship',
  };
  const mockInstance = {
    hrid: '1234',
    source: 'Acme Library',
    catalogedDate: '2022-01-01',
    statusId: '1',
    statusUpdatedDate: '2022-01-01',
    modeOfIssuanceId: '2',
    statisticalCodeIds: ['1', '2'],
    title: 'Test Book',
    alternativeTitles: ['Alternate Title'],
    indexTitle: 'Index Title',
    series: 'Test Series',
    identifiers: ['ISBN 1234567890'],
    contributors: [{
      name: 'John Doe',
      roles: ['Author'],
    }],
    publication: [{
      publisher: 'Test Publisher',
      dateOfPublication: '2022',
    }],
    editions: ['First Edition'],
    physicalDescriptions: ['300 pages'],
    instanceTypeId: '3',
    natureOfContentTermIds: ['4', '5'],
    instanceFormatIds: ['6', '7'],
    languages: ['English'],
    publicationFrequency: 'Monthly',
    publicationRange: '2022',
    notes: ['Test Note'],
    electronicAccess: [{
      uri: 'https://example.com',
      linkText: 'Example Website',
      materialsSpecification: 'Test Specification',
      publicNote: 'Test Note',
      relationshipId: '8',
    }],
    subjects: [{
      subject: 'Test Subject',
      subjectTypeId: '9',
      classificationPart: 'Test Classification Part',
      edition: 'Test Edition',
      assigner: 'Test Assigner',
      source: 'Test Source',
      statusId: '10',
      note: 'Test Note',
    }],
    classifications: [{
      classificationTypeId: '11',
      classificationNumber: 'Test Classification Number',
      edition: 'Test Edition',
      assigner: 'Test Assigner',
      source: 'Test Source',
      statusId: '12',
      note: 'Test Note',
    }],
    childInstances: [{
      instanceId: '13',
      relationshipTypeId: '14',
      note: 'Test Note',
    }],
    parentInstances: [{
      instanceId: '15',
      relationshipTypeId: '16',
      note: 'Test Note',
    }],
  };
  it('should return the correct accordion state', () => {
    const expectedState = {
      [accordions.administrative]: true,
      [accordions.title]: true,
      [accordions.identifiers]: true,
      [accordions.contributors]: true,
      [accordions.descriptiveData]: true,
      [accordions.notes]: true,
      [accordions.electronicAccess]: true,
      [accordions.subjects]: true,
      [accordions.classifications]: true,
      [accordions.relationship]: true,
    };
    expect(getAccordionState(mockInstance, accordions)).toEqual(expectedState);
  });
});
