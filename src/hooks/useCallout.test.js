import React from 'react';
import '../../test/jest/__mock__';
import { CalloutContext } from '@folio/stripes/core';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';
import useCallout from './useCallout';

describe('useCallout', () => {
  it('should return the value from CalloutContext', () => {
    const value = { showMessage: jest.fn() };
    const TestComponent = () => {
      const callout = useCallout();
      callout.showMessage('Test message');
      return null;
    };
    renderWithIntl(
      <CalloutContext.Provider value={value}>
        <TestComponent />
      </CalloutContext.Provider>,
      translationsProperties
    );
    expect(value.showMessage).toHaveBeenCalledWith('Test message');
  });
});
