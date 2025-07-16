import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { IfPermission } from '@folio/stripes/core';

import NewInstanceRequestButton, {
  getInstanceRequestLink,
} from './NewInstanceRequestButton';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
    useIntl: () => intl,
  };
});

describe('NewInstanceRequestButton', () => {
  const labelIds = {
    newRequest: 'ui-inventory.newRequest',
  };
  const instanceId = 'testInstanceId';

  afterEach(() => {
    IfPermission.mockClear();
  });

  describe('when TLR in disabled', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <NewInstanceRequestButton
            isTlrEnabled={false}
            instanceId={instanceId}
          />
        </BrowserRouter>
      );
    });

    it('should not render button', () => {
      expect(screen.queryByText(labelIds.newRequest)).not.toBeInTheDocument();
    });
  });

  describe('when TLR is enabled', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <NewInstanceRequestButton
            isTlrEnabled
            instanceId={instanceId}
          />
        </BrowserRouter>
      );
    });

    it('should check user for permission to create requests', () => {
      const expectedResult = {
        perm: 'ui-requests.create',
      };

      expect(IfPermission).toHaveBeenCalledWith(expect.objectContaining(expectedResult), {});
    });

    it('should render Button with correct props', () => {
      const expectedResult = getInstanceRequestLink(instanceId);

      expect(screen.getByRole('button')).toHaveAttribute('href', expectedResult);
      expect(screen.getByText(labelIds.newRequest)).toBeVisible();
    });
  });
});
