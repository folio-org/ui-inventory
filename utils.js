import _ from 'lodash';
import queryString from 'query-string';
import identifierTypes from './data/instance-identifier-types';

export default {

  localizeDate: (dateString, locale) => (dateString ? new Date(Date.parse(dateString)).toLocaleDateString(locale) : ''),

  identifiersFormatter: (r) => {
    let formatted = '';
    if (r.identifiers && r.identifiers.length) {
      for (let i = 0; i < r.identifiers.length; i += 1) {
        const id = r.identifiers[i];
        const type = identifierTypes.typeById(id.typeId);
        formatted += (i > 0 ? ', ' : '') +
                     id.value +
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
