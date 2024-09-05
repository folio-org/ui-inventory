import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';

import * as Formatter from './referenceFormatters';

describe('ContributorsFormatter', () => {
  it('Return formatted data for contributors', () => {
    const r = { contributors: [{ contributorNameTypeId: '1', name: 'John Doe' }] };
    const contributorTypes = [{ id: '1', name: 'Author' }];
    expect(Formatter.default.contributorsFormatter(r, contributorTypes)).toEqual('John Doe (Author)');
  });
});

describe('electronicAccessFormatter', () => {
  afterEach(cleanup);
  it('format the electronic access correctly', () => {
    const r = {
      electronicAccess: [
        {
          relationshipId: 1,
          uri: 'http://example.com',
          linkText: 'link text',
          materialsSpecification: 'specification',
          publicNote: 'note'
        },
        {
          relationshipId: 2,
          uri: 'http://example2.com',
          linkText: 'link text 2',
          materialsSpecification: 'specification 2',
          publicNote: 'note 2'
        }
      ]
    };
    const electronicAccessRelationships = [
      { id: 1, name: 'Relationship 1' },
      { id: 2, name: 'Relationship 2' }
    ];
    const { getByText } = render(Formatter.default.electronicAccessFormatter(r, electronicAccessRelationships));
    expect(getByText('; http://example.com; link text; specification; note')).toBeTruthy();
    expect(getByText('; http://example2.com; link text 2; specification 2; note 2')).toBeTruthy();
  });

  it('return empty if no electronicAccess', () => {
    const r = {
      electronicAccess: []
    };
    const electronicAccessRelationships = [
      { id: 1, name: 'Relationship 1' },
      { id: 2, name: 'Relationship 2' }
    ];
    const { queryByText } = render(Formatter.default.electronicAccessFormatter(r, electronicAccessRelationships));
    expect(queryByText('Relationship 1; http://example.com; link text; specification; note')).toBeFalsy();
    expect(queryByText('Relationship 2; http://example2.com; link text 2; specification 2; note 2')).toBeFalsy();
  });

  it('return empty if no relationshipId match', () => {
    const r = {
      electronicAccess: [
        {
          relationshipId: 3,
          uri: 'http://example.com',
          linkText: 'link text',
          materialsSpecification: 'specification',
          publicNote: 'note'
        }
      ]
    };
    const electronicAccessRelationships = [
      { id: 1, name: 'Relationship 1' },
      { id: 2, name: 'Relationship 2' }
    ];
    const { queryByText } = render(Formatter.default.electronicAccessFormatter(r, electronicAccessRelationships));
    expect(queryByText('Relationship 1; http://example.com; link text; specification; note')).toBeFalsy();
    expect(queryByText('Relationship 2; http://example.com; link text; specification; note')).toBeFalsy();
  });
});

describe('relationsFormatter', () => {
  const instanceRelationshipTypes = [
    { id: '1', name: 'Parent' },
    { id: '2', name: 'Child' },
  ];
  it('Format the relationship with parent and child', () => {
    const r = {
      childInstances: [{ instanceRelationshipTypeId: '2' }],
      parentInstances: [{ instanceRelationshipTypeId: '1' }],
    };
    expect(Formatter.default.relationsFormatter(r, instanceRelationshipTypes)).toBe('Parent');
  });
  it('Format the relationship with only child', () => {
    const r = { childInstances: [{ instanceRelationshipTypeId: '2' }] };
    expect(Formatter.default.relationsFormatter(r, instanceRelationshipTypes)).toBe('Child (M)');
  });
  it('Return an empty string if there are no relationships', () => {
    const r = {};
    expect(Formatter.default.relationsFormatter(r, instanceRelationshipTypes)).toBe('');
  });
});
