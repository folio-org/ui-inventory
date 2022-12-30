import { render } from '@testing-library/react';
import * as Formatter from './referenceFormatters';

describe('ContributorsFormatter', () => {
  it('Return formatted data for contributors', () => {
    const r = { contributors: [{ contributorNameTypeId: '1', name: 'John Doe' }] };
    const contributorTypes = [{ id: '1', name: 'Author' }];
    expect(Formatter.default.contributorsFormatter(r, contributorTypes)).toEqual('John Doe (Author)');
  });
});

describe('electronicAccessFormatter', () => {
  it('Render the correct values in the list of <div> elements', () => {
    const r = { electronicAccess: [{
      relationshipId: 1,
      uri: 'https://TestingURL.com',
      linkText: 'linkText',
      materialsSpecification: 'materialsSpecification',
      publicNote: 'publicNote',
    }] };
    const electronicAccessRelationships = [{ id: 1, name: 'name' }];
    const { container } = render(Formatter.default.electronicAccessFormatter(r, electronicAccessRelationships));
    expect(container.querySelector('div[keys="0"]').textContent).toBe('; https://TestingURL.com; linkText; materialsSpecification; publicNote');
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
