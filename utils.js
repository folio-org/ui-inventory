import _ from 'lodash';
import queryString from 'query-string';

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

  removeQueryParam: (qp, loc, hist) => {
    const parsed = queryString.parse(loc.search);
    _.unset(parsed, qp);
    hist.push(`${loc.pathname}?${queryString.stringify(parsed)}`);
  },

};
