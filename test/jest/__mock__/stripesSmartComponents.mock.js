import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  LocationSelection: ({ onSelect }) => (
    <button data-testid="LocationSelectionSelectBtn" type="button" onClick={onSelect}>
      Select
    </button>
  ),
  ViewMetaData: () => <div>ViewMetaData</div>,
  ControlledVocab: () => <div>ControlledVocab</div>,
  // useRemoteStorageMappings: () => <div>useRemoteStorageMappings</div>,
}), { virtual: true });
