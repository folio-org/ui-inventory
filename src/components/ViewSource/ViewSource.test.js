import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';
import ViewSource from './ViewSource';
import useInstance from '../../common/hooks/useInstance';
import useGoBack from '../../common/hooks/useGoBack';

jest.mock('../../common/hooks/useInstance', () => jest.fn());
jest.mock('../../common/hooks/useGoBack', () => jest.fn());

const mutator = {
  marcRecord: {
    GET: jest.fn().mockResolvedValue({}),
  },
};

const mockGoBack = jest.fn();

const getViewSource = (props = {}) => (
  <Router>
    <ViewSource
      mutator={mutator}
      instanceId="instance-id"
      holdingsRecordId="holdings-record-id"
      {...props}
    />
  </Router>
);

describe('ViewSource', () => {
  beforeEach(() => {
    useGoBack.mockReturnValue(mockGoBack);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when data is loading', () => {
    beforeEach(async () => {
      useInstance.mockReturnValue({
        isLoading: true,
        instance: null,
      });

      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should render LoadingView', () => {
      expect(screen.getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('when marc source request is failed', () => {
    beforeEach(async () => {
      useInstance.mockReturnValue({
        isLoading: true,
        instance: null,
      });
      mutator.marcRecord.GET.mockRejectedValueOnce('marcRecord error');

      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should call goBack', () => {
      expect(mockGoBack).toBeCalledTimes(1);
    });
  });

  describe('when data is loaded', () => {
    beforeEach(async () => {
      useInstance.mockReturnValue({
        isLoading: false,
        instance: { title: 'Instance title' },
      });

      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should render QuickMarcView', () => {
      expect(screen.getByText('QuickMarcView')).toBeInTheDocument();
    });

    it('should initiate useGoBack with correct path', () => {
      expect(useGoBack).toBeCalledWith('/inventory/view/instance-id');
    });

    describe('when QuickMarcView is closed', () => {
      beforeEach(() => {
        userEvent.click(screen.getByText('QuickMarcView'));
      });

      it('should call onClose with correct url', async () => {
        expect(mockGoBack).toBeCalledTimes(1);
      });
    });
  });
});
