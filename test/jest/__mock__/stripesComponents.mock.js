import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
  LoadingPane: () => <div>LoadingPane</div>,
  ConfirmationModal: jest.fn(({ heading, message, onConfirm, onCancel }) => (
    <div>
      <span>ConfirmationModal</span>
      {heading}
      <div>{message}</div>
      <div>
        <button type="button" onClick={onConfirm}>confirm</button>
        <button type="button" onClick={onCancel}>cancel</button>
      </div>
    </div>
  )),
}), { virtual: true });
