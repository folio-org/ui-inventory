import React from 'react';
import {
  render
} from '@folio/jest-config-stripes/testing-library/react';
import CalloutRenderer from './CalloutRenderer';
import useCallout from '../../hooks/useCallout';

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

    render(<CalloutRenderer message={message} type={MESSAGES.ERROR} />);

    expect(useCallout).toHaveBeenCalled();

    expect(useCallout().sendCallout).toHaveBeenCalledWith({
      type: MESSAGES.ERROR,
      message: 'This is a test message'
    });
  });

  it('should render and call sendCallout with default type', () => {
    const message = 'This is a test message';

    render(<CalloutRenderer message={message} />);

    expect(useCallout).toHaveBeenCalled();

    expect(useCallout().sendCallout).toHaveBeenCalledWith({
      type: MESSAGES.SUCCESS,
      message: 'This is a test message'
    });
  });
});
