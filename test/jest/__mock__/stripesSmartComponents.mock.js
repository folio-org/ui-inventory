import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  ViewMetaData: () => <div>ViewMetaData</div>,
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
}), { virtual: true });
