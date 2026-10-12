import '../../../test/jest/__mock__';
import { instance } from '../../../test/fixtures/instance';
import { getPublishingInfo, getAccordionState } from './utils';

describe('getPublishingInfo', () => {
  it('returns expected string when publication object exists with dateOfPublication', () => {
    const instanceProps = {
      publication: [
        {
          publisher: 'Publisher',
          dateOfPublication: '2022-01-01',
        },
      ],
    };
    expect(getPublishingInfo(instanceProps)).toEqual(' • Publisher • 2022-01-01');
  });
  it('returns expected string when publication object exists without dateOfPublication', () => {
    const instanceProps = {
      publication: [
        {
          publisher: 'Publisher',
        },
      ],
    };
    expect(getPublishingInfo(instanceProps)).toEqual(' • Publisher');
  });
  it('returns expected string when publication object exists without publisher', () => {
    const instanceProps = {
      publication: [
        {
          dateOfPublication: '2022',
        },
      ],
    };
    expect(getPublishingInfo(instanceProps)).toEqual(' • 2022');
  });
  it('returns undefined when publication object does not exist', () => {
    const instanceProps = {};
    expect(getPublishingInfo(instanceProps)).toBeUndefined();
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
  const mockInstance = instance;
  it('should return the correct accordion state', () => {
    const expectedState = {
      [accordions.administrative]: true,
      [accordions.title]: true,
      [accordions.identifiers]: false,
      [accordions.contributors]: false,
      [accordions.descriptiveData]: true,
      [accordions.notes]: false,
      [accordions.electronicAccess]: false,
      [accordions.subjects]: false,
      [accordions.classifications]: false,
      [accordions.relationship]: false,
    };
    expect(getAccordionState(mockInstance, accordions)).toEqual(expectedState);
  });
});
