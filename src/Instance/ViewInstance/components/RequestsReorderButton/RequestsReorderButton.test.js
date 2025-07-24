import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { IfPermission } from '@folio/stripes/core';

import RequestsReorderButton, {
  getInstanceQueueReorderLink,
} from './RequestsReorderButton';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
    useIntl: () => intl,
  };
});

const requestId = 'testRequestId';
const instanceId = 'testInstanceId';

describe('RequestsReorderButton', () => {
  const labelIds = {
    viewAndReorderRequestsQueue: 'ui-inventory.viewAndReorderRequestsQueue',
  };
  const defaultProps = {
    requestId,
    instanceId,
  };

  afterEach(() => {
    IfPermission.mockClear();
  });

  describe('When `hasReorderPermissions` is true', () => {
    const hasReorderPermissions = true;

    describe('when `numberOfRequests` is 0', () => {
      const numberOfRequests = 0;

      beforeEach(() => {
        render(
          <BrowserRouter>
            <RequestsReorderButton
              hasReorderPermissions={hasReorderPermissions}
              numberOfRequests={numberOfRequests}
              {...defaultProps}
            />
          </BrowserRouter>
        );
      });

      it('should not render button', () => {
        expect(screen.queryByText(labelIds.viewAndReorderRequestsQueue)).not.toBeInTheDocument();
      });
    });

    describe('when `numberOfRequests` is more than 0', () => {
      const numberOfRequests = 1;

      beforeEach(() => {
        render(
          <BrowserRouter>
            <RequestsReorderButton
              hasReorderPermissions={hasReorderPermissions}
              numberOfRequests={numberOfRequests}
              {...defaultProps}
            />
          </BrowserRouter>
        );
      });

      it('should check for permission to reorder requests queue', () => {
        const expectedResult = { perm: 'ui-requests.reorderQueue.execute' };

        expect(IfPermission).toHaveBeenCalledWith(expect.objectContaining(expectedResult), {});
      });

      it('should render button with passed props', () => {
        const expectedResult = getInstanceQueueReorderLink(defaultProps.requestId, defaultProps.instanceId);

        expect(screen.getByRole('button')).toHaveAttribute('href', expectedResult);
        expect(screen.getByText(labelIds.viewAndReorderRequestsQueue)).toBeInTheDocument();
      });
    });
  });

  describe('When `hasReorderPermissions` is false', () => {
    const hasReorderPermissions = false;
    describe('when `numberOfRequests` is 0', () => {
      const numberOfRequests = 0;

      beforeEach(() => {
        render(
          <BrowserRouter>
            <RequestsReorderButton
              hasReorderPermissions={hasReorderPermissions}
              numberOfRequests={numberOfRequests}
              {...defaultProps}
            />
          </BrowserRouter>
        );
      });

      it('should not render button', () => {
        expect(screen.queryByText(labelIds.viewAndReorderRequestsQueue)).not.toBeInTheDocument();
      });
    });

    describe('when `numberOfRequests` is more than 0', () => {
      const numberOfRequests = 1;

      beforeEach(() => {
        render(
          <BrowserRouter>
            <RequestsReorderButton
              hasReorderPermissions={hasReorderPermissions}
              numberOfRequests={numberOfRequests}
              {...defaultProps}
            />
          </BrowserRouter>
        );
      });

      it('should not render button', () => {
        expect(screen.queryByText(labelIds.viewAndReorderRequestsQueue)).not.toBeInTheDocument();
      });
    });
  });
});

describe('getInstanceQueueReorderLink', () => {
  it('should return correct link', () => {
    const expectedResult = `/requests/view/${requestId}/${instanceId}/reorder`;

    expect(getInstanceQueueReorderLink(requestId, instanceId)).toBe(expectedResult);
  });
});
