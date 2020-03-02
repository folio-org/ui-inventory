import React from 'react';
import { Link } from 'react-router-dom';
import languagetable from './data/languages';

export default {
  identifiersFormatter: (r, identifierTypes) => {
    const formatted = [];
    if (r.identifiers && r.identifiers.length) {
      r.identifiers.forEach((identifier) => {
        const type = identifierTypes.find(it => it.id === identifier.identifierTypeId);
        formatted.push(`${type ? `${type.name} ` : ''}${identifier.value}`);
      });
    }
    return formatted.sort().map((id, i) => <div key={i}>{id}</div>);
  },

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

  publishersFormatter: (r) => {
    const formatted = [];
    if (r.publication && r.publication.length) {
      r.publication.forEach((pub) => {
        if (pub !== null) formatted.push(`${pub.publisher}${pub.place ? `, ${pub.place}` : ''}${pub.dateOfPublication ? ` (${pub.dateOfPublication})` : ''} ${pub.role ? ` (Role: ${pub.role})` : ''}`);
      });
    }
    return formatted.map((p, i) => <div key={i}>{p}</div>);
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

  languagesFormatter: (r) => {
    let formatted = '';
    if (r.languages && r.languages.length) {
      for (let i = 0; i < r.languages.length; i += 1) {
        const langCode = r.languages[i];
        const langName = languagetable.languageByCode(langCode);
        if (langName) formatted += (i > 0 ? ', ' : '') + (langName);
      }
    }
    return formatted;
  },

  instanceFormatsFormatter: (r, instanceFormats) => {
    let formatted = '';
    if (r.instanceFormatId) {
      const format = instanceFormats.find(fmt => fmt.id === r.instanceFormatId);
      if (format) {
        formatted = format.name;
      }
    }
    return formatted;
  },

  instanceTypesFormatter: (r, instanceTypes) => {
    let formatted = '';
    if (r.instanceTypeId) {
      const qualifier = instanceTypes.find(type => type.id === r.instanceTypeId);
      if (qualifier) {
        formatted = qualifier.name;
      }
    }
    return formatted;
  },

  modesOfIssuanceFormatter: (r, modesOfIssuance) => {
    let formatted = '';
    if (r.modeOfIssuanceId) {
      const qualifier = modesOfIssuance.find(type => type.id === r.modeOfIssuanceId);
      if (qualifier) {
        formatted = qualifier.name;
      }
    }
    return formatted;
  },

  classificationsFormatter: (r, classificationTypes) => {
    const formatted = [];
    if (r.classifications && r.classifications.length) {
      r.classifications.forEach((classification) => {
        const type = classificationTypes.find(ct => ct.id === classification.classificationTypeId);
        formatted.push(`${type ? `${type.name} ` : ''}${classification.classificationNumber}`);
      });
    }
    return formatted.sort().map((c, i) => <div key={i}>{c}</div>);
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

  childInstancesFormatter: (r, instanceRelationshipTypes, location) => {
    const formatted = [];
    if (r.childInstances && r.childInstances.length) {
      r.childInstances.forEach((instance) => {
        const viewRelatedInstanceLink = `/inventory/view/${instance.subInstanceId}/${location.search}`;
        formatted.push(<Link to={viewRelatedInstanceLink}>{instance.subInstanceId}</Link>);
      });
    }
    return formatted.map((elem, i) => <div key={i}>{elem}</div>);
  },

  parentInstancesFormatter: (r, instanceRelationshipTypes, location) => {
    const formatted = [];
    if (r.parentInstances && r.parentInstances.length) {
      const viewRelatedInstanceLink = `/inventory/view/${r.parentInstances[0].superInstanceId}/${location.search}`;
      formatted.push(
        <Link to={viewRelatedInstanceLink}>
          {`${r.parentInstances[0].superInstanceId} (M)`}
        </Link>
      );
    }
    return formatted.map((elem, i) => <div key={i}>{elem}</div>);
  },

  precedingTitlesFormatter: (r, location) => {
    const formatted = [];
    if (r.precedingTitles && r.precedingTitles.length) {
      r.precedingTitles.forEach((title) => {
        const viewPrecedingTitleLink = `/inventory/view/${title.precedingInstanceId}/${location.search}`;
        formatted.push(
          <Link to={viewPrecedingTitleLink}>
            {`${title.title}`}
          </Link>
        );
      });
    }
    return formatted.map((elem, i) => <div key={i}>{elem}</div>);
  },

  succeedingTitlesFormatter: (r, location) => {
    const formatted = [];
    if (r.succeedingTitles && r.succeedingTitles.length) {
      r.succeedingTitles.forEach((title) => {
        const viewSucceedingTitleLink = `/inventory/view/${title.succeedingInstanceId}/${location.search}`;
        formatted.push(
          <Link to={viewSucceedingTitleLink}>
            {`${title.title}`}
          </Link>
        );
      });
    }
    return formatted.map((elem, i) => <div key={i}>{elem}</div>);
  },

};
