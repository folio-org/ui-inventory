import data from './languages.json';

const languages = {
  selectOptions: selected => data.map(
    l => ({
      label: l.name,
      value: l.code,
      selected: l.code === selected
    })
  ),

  languageByCode: (code) => {
    const lang = data.find(l => l.code === code);
    return lang ? lang.name : null;
  }
};

export default languages;
