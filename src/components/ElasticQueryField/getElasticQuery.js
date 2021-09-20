import cqlParser from './cqlParser';

// The regExp will look like:
// /keyword \(title, contributor, identifier\)|title \(all\)|contributor|
// identifier \(all\)|issn|isbn|subject|instance uuid|instance hrid|=/gi
const createRegexpToElasticSearch = (templates) => {
  let string = '';

  for (const searchOption in templates) {
    if (Object.prototype.hasOwnProperty.call(templates, searchOption)) {
      string += `${searchOption}|`.replace(/[()]/g, m => `\\${m}`);
    }
  }

  return new RegExp(`${string}`.replace(/\|$/, ''), 'gi');
};

// The templates will look like:
// {
//   =: ""
//   contributor: "contributors="
//   identifier (all): "identifiers.value=="
//   instance hrid: "hrid=="
//   instance uuid: "id=="
//   isbn: "isbn=="
//   issn: "issn=="
//   keyword (title, contributor, identifier): "keyword all"
//   subject: "subjects all"
//   title (all): "title all"
// }
const getElasticTemplates = (searchOptions, operators) => {
  const indexTemplates = searchOptions.reduce((accum, { label, queryTemplate }) => {
    accum[label.toLowerCase()] = queryTemplate;
    return accum;
  }, {});

  const operatorTemplates = operators.reduce((accum, { label, queryTemplate }) => {
    accum[label.toLowerCase()] = queryTemplate;
    return accum;
  }, {});

  return { ...indexTemplates, ...operatorTemplates };
};

const replaceLabelsWithTemplates = (cp, searchOptions, operators) => {
  const templates = getElasticTemplates(searchOptions, operators);
  const regExp = createRegexpToElasticSearch(templates);

  return cp.toString()
    .replace(regExp, m => templates[m.toLowerCase()])
    .replace(/ {2}/g, ' ');
};

// For example:
// value: "Title (all)" = (Ukraine or "Los Angeles")
// return: title all "Ukraine" OR title all "Los Angeles"
// or
// value: Ukraine
// return: keyword all "Ukraine"
const getElasticQuery = (value, isSearchByKeyword, searchOptions, operators, intl) => {
  if (isSearchByKeyword) {
    const keywordAll = searchOptions.find(option => option.value === 'all')?.queryTemplate;
    return `${keywordAll} "${value}"`;
  }

  const cp = cqlParser(intl);
  cp.parse(value);
  return replaceLabelsWithTemplates(cp, searchOptions, operators);
};

export default getElasticQuery;
