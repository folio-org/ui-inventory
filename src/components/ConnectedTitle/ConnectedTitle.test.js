import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { keyBy } from 'lodash';

import { DataContext } from '../../contexts';
import { identifierTypes, instanceRelationshipTypes } from '../../../test/fixtures';
import ConnectedTitle from './ConnectedTitle';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

jest.mock('../InstancePlugin/InstancePlugin', () => ({ onSelect, onClose }) => {
  return (
    <div>
      <div>InstancePlugin</div>
      <button type="button" onClick={() => onSelect()}>onSelect</button>
      <button type="button" onClick={() => onClose()}>onClose</button>
    </div>
  );
});

const renderConnectedTitle = (props = {}) => renderWithIntl(
  <Router>
    <DataContext.Provider value={{
      contributorTypes: [],
      identifierTypes,
      identifierTypesById: keyBy(identifierTypes, 'id'),
      identifierTypesByName: keyBy(identifierTypes, 'name'),
      instanceRelationshipTypes,
      instanceRelationshipTypesById: keyBy(identifierTypes, 'id'),
      instanceFormats: [],
      modesOfIssuance: [],
      natureOfContentTerms: [],
      tagsRecords: [],
    }}
    >
      <ConnectedTitle
        instance={{
          title: '',
          hrid: '',
          identifiers: [],
        }}
        onSelect={() => {}}
        titleIdKey="id"
        {...props}
      />
    </DataContext.Provider>
  </Router>
);


describe('ConnectedTitle', () => {
  it('should render correct titles', () => {
    const { queryByText } = renderConnectedTitle();

    expect(queryByText('ui-inventory.precedingField.title')).toBeInTheDocument();
    expect(queryByText('ui-inventory.precedingField.connected')).toBeInTheDocument();
    expect(queryByText('ui-inventory.instanceHrid')).toBeInTheDocument();
    expect(queryByText('ui-inventory.isbn')).toBeInTheDocument();
    expect(queryByText('ui-inventory.issn')).toBeInTheDocument();
  });

  it('should render fallback data if props are not present', () => {
    const { queryAllByText } = renderConnectedTitle();

    // 3 - means for isbn, issn and hrid
    expect(queryAllByText('ui-inventory.notAvailable').length).toBe(3);
  });

  it('should render correct data based on props', () => {
    const { queryByText } = renderConnectedTitle({
      instance: {
        title: 'test-title',
        hrid: 'test-hrid',
        identifiers: [
          { identifierTypeId: '8261054f-be78-422d-bd51-4ed9f33c3422', value: '1111' },
          { identifierTypeId: 'c858e4f2-2b6b-4385-842b-60732ee14abb', value: '2222' },
        ],
      },
    });

    expect(queryByText('ui-inventory.notAvailable')).not.toBeInTheDocument();

    expect(queryByText('test-title')).toBeInTheDocument();
    expect(queryByText('test-hrid')).toBeInTheDocument();
    expect(queryByText('1111')).toBeInTheDocument();
    expect(queryByText('2222')).toBeInTheDocument();
  });
});
