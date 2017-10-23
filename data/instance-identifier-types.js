const data = [
            { id: '8261054f-be78-422d-bd51-4ed9f33c3422', name: 'ISBN' },
            { id: '913300b2-03ed-469a-8179-c1092c991227', name: 'ISSN' },
            { id: 'c858e4f2-2b6b-4385-842b-60732ee14abb', name: 'Standard Technical Report number' },
            { id: 'b5d8cdc4-9441-487c-90cf-0c7ec97728eb', name: 'Publisher Number' },
            { id: '593b78cb-32f3-44d1-ba8c-63fd5e6989e6', name: 'CODEN' },
            { id: '5d164f4b-0b15-4e42-ae75-cfcf85318ad9', name: 'Control Number (001)' },
            { id: '351ebc1c-3aae-4825-8765-c6d50dbf011f', name: 'GPO Item Number' },
            { id: 'c858e4f2-2b6b-4385-842b-60732ee14abb', name: 'LCCN' },
            { id: '7e591197-f335-4afb-bc6d-a6d76ca3bace', name: 'System Control Number' },
            { id: '2e8b3b6c-0e7d-4e48-bca2-b0b23b376af5', name: 'Other Standard Identifier' },
            { id: '7f907515-a1bf-4513-8a38-92e1a07c539d', name: 'ASIN' },
            { id: '650ef996-35e3-48ec-bf3a-a0d078a0ca37', name: 'UkMac' },
            { id: '3fbacad6-0240-4823-bce8-bb122cfdf229', name: 'StEdNL' },
            { id: '3187432f-9434-40a8-8782-35a111a1491e', name: 'BNB' },
            { id: '439bfbae-75bc-4f74-9fc7-b2a2d47ce3ef', name: 'OCLC' },
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
