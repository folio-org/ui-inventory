import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  ViewMetaData: () => <div>ViewMetaData</div>,
  ControlledVocab: jest.fn(() => <div>ControlledVocab</div>),
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
  ClipCopy: () => <button type="button">ClipCopy</button>,
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
  SearchAndSort: jest.fn(props => {
    const RealSearchAndSort = jest.requireActual('@folio/stripes/smart-components').SearchAndSort;
    return <RealSearchAndSort {...props} />;
  }),
  withTags: Component => (props) => {
    return <Component {...props} tagsEnabled={true} />;
  },
}), { virtual: true });

