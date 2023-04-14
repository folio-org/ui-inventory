import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ControlledVocab: () => <div>ControlledVocab</div>,
  ConfigManager: (props) => {
    const { getInitialValues, onBeforeSave, children } = props;
    const component =
      <div>
        <div>ConfigManager</div>
        {children}
        <button type="button" onClick={() => getInitialValues()}>getInitialValues</button>
        <button type="button" onClick={() => onBeforeSave()}>onBeforeSave</button>
      </div>;
    return component;
  },
  LocationLookup: () => <div>LocationLookup</div>,
  LocationSelection: jest.fn(({ onSelect }) => (
    <button data-testid="LocationSelectionSelectBtn" type="button" onClick={onSelect}>Select</button>
  )),
  useRemoteStorageMappings: () => {
    return ({
      'holdings-id-1': {
        'id': 'holdings-id-1',
        'name': 'Storage A',
        'description': 'Storage A description'
      },
      'holdings-id-2': {
        'id': 'holdings-id-2',
        'name': 'Storage B',
        'description': 'Storage B description'
      }
    });
  },
  ViewMetaData: () => <div>ViewMetaData</div>,
}), { virtual: true });
