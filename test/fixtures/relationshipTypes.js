import { instanceRelationshipTypes } from './instanceRelationshipTypes';

export const relationshipTypes = instanceRelationshipTypes.map(it => ({
  label: it.name,
  value: it.id,
}));
