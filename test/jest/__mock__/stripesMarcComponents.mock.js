import React from 'react';

jest.mock('@folio/stripes-marc-components', () => ({
  ...jest.requireActual('@folio/stripes-marc-components'),
  MarcView: jest.fn(({ onClose, marcTitle, actionMenu, lastMenu }) => (
    <>
      {marcTitle}
      <button type="button" onClick={onClose}>
        MarcView
      </button>
      {actionMenu({ onToggle: jest.fn() })}
      {lastMenu}
    </>
  )),
}));
