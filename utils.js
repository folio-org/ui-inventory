
export default {

  localizeDate: (dateString, locale) => (dateString ? new Date(Date.parse(dateString)).toLocaleDateString(locale) : ''),

  identifiersFormatter: (r) => {
      let formatted = '';
      if (r.identifiers && r.identifiers.length) {
        for (let i = 0; i < r.identifiers.length; i += 1) {
          const id = r.identifiers[i];
          formatted += (i > 0 ? ', ' : '') +
                       id.value +
                       (id.namespace && id.namespace.length ? ` (${id.namespace})` : '');
        }
      }
      return formatted;
    },

};
