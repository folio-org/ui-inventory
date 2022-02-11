import React from 'react';

jest.mock('@folio/quick-marc/src/QuickMarcView/QuickMarcView', () => ({ onClose }) => (
  <button type="button" onClick={onClose}>
    QuickMarcView
  </button>
));
