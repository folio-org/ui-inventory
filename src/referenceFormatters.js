import React from 'react';

export default {
  contributorsFormatter: (r, contributorTypes) => {
    let formatted = '';
    if (r.contributors && r.contributors.length) {
      for (let i = 0; i < r.contributors.length; i += 1) {
        const contributor = r.contributors[i];
        const type = contributorTypes.find(ct => ct.id === contributor.contributorNameTypeId);
        formatted += (i > 0 ? ' ; ' : '') +
                     contributor.name +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  },

  electronicAccessFormatter: (r, electronicAccessRelationships) => {
    const formatted = [];
    if (r.electronicAccess && r.electronicAccess.length) {
      r.electronicAccess.forEach((ea) => {
        if (ea !== null) {
          let relationshipName = '';
          if (ea.relationship) {
            const relationship = electronicAccessRelationships.find(ear => ear.id === ea.relationshipId);
            if (relationship) {
              relationshipName = relationship.name;
            }
          }
          formatted.push(`${relationshipName}; ${ea.uri}; ${ea.linkText}; ${ea.materialsSpecification}; ${ea.publicNote}`);
        }
      });
    }
    return formatted.map((p, i) => <div key={i}>{p}</div>);
  },

  relationsFormatter: (r, instanceRelationshipTypes) => {
    let formatted = '';
    if (r.childInstances && r.childInstances.length) {
      const relationship = instanceRelationshipTypes.find(irt => irt.id === r.childInstances[0].instanceRelationshipTypeId);
      formatted = relationship.name + ' (M)';
    }
    if (r.parentInstances && r.parentInstances.length) {
      const relationship = instanceRelationshipTypes.find(irt => irt.id === r.parentInstances[0].instanceRelationshipTypeId);
      formatted = relationship.name;
    }
    return formatted;
  },
};
