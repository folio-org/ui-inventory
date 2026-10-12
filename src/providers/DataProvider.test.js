import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useCommonData } from '@folio/stripes-inventory-components';

import { resources } from '../../test/fixtures/DataProviders';

import DataProvider from './DataProvider';
import { DataContext } from '../contexts';
import {
  useCallNumberBrowseConfig,
  useClassificationBrowseConfig,
} from '../hooks';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useClassificationBrowseConfig: jest.fn(),
  useCallNumberBrowseConfig: jest.fn(),
}));

const commonData = {
  locations: [{ id: 'id-1', tenantId: 'cs00000int_0001' }],
  consortiaTenants: [{ id: 'cs00000int_0001', name: 'College' }],
  consortiaTenantsById: {
    cs00000int_0001: { id: 'cs00000int_0001', name: 'College' },
  },
  statisticalCodes: [{
    id: 'id-1',
    statisticalCodeType: { id: '3abd6fc2-b3e4-4879-b1e1-78be41769fe3', name: 'ARL (Collection stats)' },
    statisticalCodeTypeId: '3abd6fc2-b3e4-4879-b1e1-78be41769fe3',
  }],
  statisticalCodeTypes: [{ id: '3abd6fc2-b3e4-4879-b1e1-78be41769fe3', name: 'ARL (Collection stats)' }],
  materialTypes: [{ id: 'id-1', name: 'book' }],
  natureOfContentTerms: [{ id: 'id-1', name: 'audiobook' }],
  holdingsTypes: [{ id: 'id-1', name: 'Electronic' }],
  modesOfIssuance: [{ id: 'id-1', name: 'serial' }],
  instanceStatuses: [{ id: 'id-1', code: 'batch' }],
  instanceFormats: [{ id: 'id-1', code: 'sb' }],
  holdingsSources: [{ id: 'id-1', name: 'FOLIO' }],
  instanceTypes: [{ id: 'id-1', code: 'crd' }],
  instanceDateTypes: [{ id: 'id-1', code: 'dt', name: 'date type' }],
};

useCommonData.mockReturnValue({
  commonData,
  isCommonDataLoading: false,
});

const classificationBrowseConfig = [
  {
    'id': 'all',
    'shelvingAlgorithm': 'default',
    'typeIds': []
  },
  {
    'id': 'dewey',
    'shelvingAlgorithm': 'dewey',
    'typeIds': []
  },
  {
    'id': 'lc',
    'shelvingAlgorithm': 'lc',
    'typeIds': []
  }
];

useClassificationBrowseConfig.mockReturnValue({
  classificationBrowseConfig,
  isLoading: false,
});

const callNumberBrowseConfig = [{
  id: 'dewey',
  shelvingAlgorithm: 'dewey',
  typeIds: ['dewey-id', 'lc-id'],
}];

useCallNumberBrowseConfig.mockReturnValue({
  callNumberBrowseConfig,
  isCallNumberConfigLoading: false,
});

const mockPassedData = jest.fn();

const Children = () => (
  <DataContext.Consumer>
    {data => {
      mockPassedData(data);
    }}
  </DataContext.Consumer>
);

const renderDataProvider = (props) => render(
  <DataProvider {...props}><Children /></DataProvider>
);

describe('DataProvider', () => {
  it('should pass correct data', () => {
    renderDataProvider({ resources });

    expect(mockPassedData).toHaveBeenCalledWith({
      ...commonData,
      classificationBrowseConfig,
      callNumberBrowseConfig,
      ...Object.keys(resources).reduce((acc, name) => ({ ...acc, [name]: resources[name].records }), {}),
      identifierTypesById: {
        'identifierTypes-1': {
          id: 'identifierTypes-1',
          name: 'IdentifierType 1',
        },
      },
      identifierTypesByName: {
        'IdentifierType 1': {
          id: 'identifierTypes-1',
          name: 'IdentifierType 1',
        },
      },
      instanceDateTypesByCode: {
        'dt': {
          id: 'id-1',
          name: 'date type',
          code: 'dt',
        },
      },
      instanceRelationshipTypesById: {
        'instanceRelationshipTypes-1': {
          id: 'instanceRelationshipTypes-1',
          name: 'InstanceRelationshipType 1',
        },
      },
      locationsById: {
        'id-1': { id: 'id-1', tenantId: 'cs00000int_0001' },
      },
      holdingsSourcesByName: {
        FOLIO: { id: 'id-1', name: 'FOLIO' },
      },
    });
  });
});
