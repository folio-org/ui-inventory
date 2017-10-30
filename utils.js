import _ from 'lodash';
import queryString from 'query-string';
import { data as languagetable } from './data/languages';


export default {

  localizeDate: (dateString, locale) => (dateString ? new Date(Date.parse(dateString)).toLocaleDateString(locale) : ''),

  identifiersFormatter: (r, identifierTypes) => {
    let formatted = '';
    if (r.identifiers && r.identifiers.length) {
      for (let i = 0; i < r.identifiers.length; i += 1) {
        const identifier = r.identifiers[i];
        const type = identifierTypes.find(it => it.id === identifier.typeId);
        formatted += (i > 0 ? ', ' : '') +
                     identifier.value +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  },

  creatorsFormatter: (r, creatorTypes) => {
    let formatted = '';
    if (r.creators && r.creators.length) {
      for (let i = 0; i < r.creators.length; i += 1) {
        const creator = r.creators[i];
        const type = creatorTypes.find(ct => ct.id === creator.creatorTypeId);
        formatted += (i > 0 ? ', ' : '') +
                     creator.name +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  },

  contributorsFormatter: (r, contributorTypes) => {
    let formatted = '';
    if (r.contributors && r.contributors.length) {
      for (let i = 0; i < r.contributors.length; i += 1) {
        const contributor = r.contributors[i];
        const type = contributorTypes.find(ct => ct.id === contributor.contributorTypeId);
        formatted += (i > 0 ? ', ' : '') +
                     contributor.name +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  },

  publishersFormatter: (r) => {
    let formatted = '';
    if (r.publication && r.publication.length) {
      for (let i = 0; i < r.publication.length; i += 1) {
        const pub = r.publication[i];
        formatted += (i > 0 ? ', ' : '') +
                     pub.publisher +
                     (pub.dateOfPublication ? ` (${pub.dateOfPublication})` : '');
      }
    }
    return formatted;
  },

  languagesFormatter: (r) => {
    let formatted = '';
    if (r.languages && r.languages.length) {
      for (let i = 0; i < r.languages.length; i += 1) {
        const languagecode = r.languages[i];
        const language = languagetable.find(lang => lang.code === languagecode);
        formatted += (i > 0 ? ', ' : '') + (language.name['#text'] || language.name);
      }
    }
    return formatted;
  },

  instanceFormatsFormatter: (r, instanceFormats) => {
    let formatted = '';
    if (r.instanceFormatId) {
      const format = instanceFormats.find(fmt => fmt.id === r.instanceFormatId);
      formatted = format.name;
    }
    return formatted;
  },

  instanceTypesFormatter: (r, instanceTypes) => {
    let formatted = '';
    if (r.instanceTypeId) {
      const qualifier = instanceTypes.find(type => type.id === r.instanceTypeId);
      formatted = qualifier.name;
    }
    return formatted;
  },

  classificationsFormatter: (r, classificationTypes) => {
    let formatted = '';
    if (r.classifications && r.classifications.length) {
      for (let i = 0; i < r.classifications.length; i += 1) {
        const classification = r.classifications[i];
        const type = classificationTypes.find(ct => ct.id === classification.classificationTypeId);
        formatted += (i > 0 ? ', ' : '') +
                     classification.classificationNumber +
                     (type ? ` (${type.name})` : '');
      }
    }
    return formatted;
  },

  removeQueryParam: (qp, loc, hist) => {
    const parsed = queryString.parse(loc.search);
    _.unset(parsed, qp);
    hist.push(`${loc.pathname}?${queryString.stringify(parsed)}`);
  },

};
