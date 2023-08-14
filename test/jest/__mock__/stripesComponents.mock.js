import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  ConfirmationModal: jest.fn(({ heading, message, onConfirm, onCancel, onRemove }) => (
    <div>
      <span>ConfirmationModal</span>
      {heading}
      <div>{message}</div>
      <div>
        <button type="button" onClick={onConfirm}>confirm</button>
        <button type="button" onClick={onCancel}>cancel</button>
        <button type="button" onClick={onRemove}>remove</button>
      </div>
    </div>
  )),
  expandAllSections: jest.fn(),
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
  HasCommand: (props) => {
    const { commands, children } = props;
    const component =
      <>
        {commands.map((shortcut, index) => (
          <button key={index} type="button" onClick={() => shortcut.handler()}>{shortcut.name}</button>
        ))}{children};
      </>;
    return component;
  },
  Loading: () => <div>Loading</div>,
  LoadingPane: () => <div>LoadingPane</div>,
  LoadingView: jest.fn(() => <div>LoadingView</div>),
}), { virtual: true });
