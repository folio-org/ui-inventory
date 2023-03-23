import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
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
  formattedLanguageName: jest.fn((languageCode) => {
    switch (languageCode) {
      case 'en':
        return 'English';
      case 'es':
        return 'Spanish';
      case 'fr':
        return 'French';
      default:
        return '';
    }
  }),
  LoadingPane: () => <div>LoadingPane</div>,
  LoadingView: () => <div>LoadingView</div>,
}), { virtual: true });
