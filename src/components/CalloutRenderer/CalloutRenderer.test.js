import React from 'react';
import {
  render
} from '@folio/jest-config-stripes/testing-library/react';
import CalloutRenderer from './CalloutRenderer';
import useCallout from '../../hooks/useCallout'; // Import the useCallout hook directly

// Mock useCallout hook
jest.mock('../../hooks/useCallout');

const MESSAGES = {
  ERROR: 'error',
  SUCCESS: 'success'
};

describe('CalloutRenderer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useCallout.mockReturnValue({
      sendCallout: jest.fn()
    });
  });

  it('should render and call sendCallout with correct arguments', () => {
    const message = 'This is a test message';

    // Render the component
    render(<CalloutRenderer message={message} type={MESSAGES.ERROR} />);

    // Assert that useCallout hook was called
    expect(useCallout).toHaveBeenCalled();

    // Assert that sendCallout was called with the correct arguments in useEffect
    expect(useCallout().sendCallout).toHaveBeenCalledWith({
      type: MESSAGES.ERROR,
      message: 'This is a test message'
    });
  });

  it('should render and call sendCallout with default type', () => {
    const message = 'This is a test message';

    // Render the component
    render(<CalloutRenderer message={message} />);

    // Assert that useCallout hook was called
    expect(useCallout).toHaveBeenCalled();

    // Assert that sendCallout was called with the correct arguments in useEffect
    expect(useCallout().sendCallout).toHaveBeenCalledWith({
      type: MESSAGES.SUCCESS,
      message: 'This is a test message'
    });
  });
});
