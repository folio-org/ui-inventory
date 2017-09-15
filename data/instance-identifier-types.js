const data = [
            { id: 'isbn', name: 'ISBN' },
            { id: 'issn', name: 'ISSN' },
            { id: '0003', name: 'Standard Technical Report number' },
            { id: '0004', name: 'Publisher Number' },
            { id: '0005', name: 'CODEN' },
            { id: '0006', name: 'Control Number (001)' },
            { id: '0007', name: 'GPO Item Number' },
            { id: 'lccn', name: 'LCCN' },
            { id: '0009', name: 'System Control Number' },
            { id: '0010', name: 'Other Standard Identifier' },
            { id: 'asin', name: 'ASIN' },
            { id: 'UkMaC', name: 'UkMac' },
            { id: 'StEdNL', name: 'StEdNL' },
            { id: 'bnb', name: 'BNB' },
            { id: '0015', name: 'OCLC' },
];

const identifierTypes = {

  selectOptions: selected => data.map(
    it => ({
      label: it.name,
      value: it.id,
      selected: it.id === selected,
    })),

  typeById: id => data.find(it => it.id === id),
};

export default identifierTypes;
