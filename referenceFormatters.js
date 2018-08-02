import React from 'react';
import { data as languagetable } from './data/languages';


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
        if (pub !== null) formatted.push(`${pub.publisher}${pub.place ? `, ${pub.place}` : ''}${pub.dateOfPublication ? ` (${pub.dateOfPublication})` : ''}`);
      });
    }
    return formatted.map((p, i) => <div key={i}>{p}</div>);
  },

  languagesFormatter: (r) => {
    let formatted = '';
    if (r.languages && r.languages.length) {
      for (let i = 0; i < r.languages.length; i += 1) {
        const languagecode = r.languages[i];
        const language = languagetable.find(lang => lang.code === languagecode);
        if (language) formatted += (i > 0 ? ', ' : '') + (language.name['#text'] || language.name);
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
};
