import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import ky from 'ky';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import ImportRecord from './ImportRecord';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';

const mockProps = {
  id: '123',
  stripes: buildStripes(),
  okapiKy: jest.fn(),
  intl: {
    formatMessage: jest.fn(),
  },
  getParams: jest.fn(() => ({
    xidtype: 'type',
    xid: 'externalId',
    jobprofileid: 'profileId',
  })),
  updateLocation: jest.fn(),
};

describe('ImportRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls loadExternalRecord on mount with correct params', async () => {
    const history = createMemoryHistory();
    const mockResponse = { internalIdentifier: 'newId' };
    mockProps.okapiKy.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockResponse) });
    await renderWithIntl(
      <Router history={history}>
        <ImportRecord {...mockProps} />
      </Router>
    );

    await waitFor(() => {
      expect(mockProps.okapiKy).toHaveBeenCalledWith('copycat/imports', {
        timeout: 30000,
        method: 'POST',
        json: {
          externalIdentifier: 'externalId',
          internalIdentifier: '123',
          profileId: 'type',
          selectedJobProfileId: 'profileId',
        },
      });

      expect(mockProps.updateLocation).toHaveBeenCalledWith(
        {
          _path: '/inventory/view/newId',
          layer: undefined,
          xid: undefined,
        },
        { replace: true }
      );
    });
  });

  it('calls loadExternalRecord on mount with empty internalIdentifier', async () => {
    const history = createMemoryHistory();
    const mockResponse = { };
    mockProps.okapiKy.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockResponse) });
    await renderWithIntl(
      <Router history={history}>
        <ImportRecord {...mockProps} />
      </Router>
    );

    await waitFor(() => {
      expect(mockProps.okapiKy).toHaveBeenCalledWith('copycat/imports', {
        timeout: 30000,
        method: 'POST',
        json: {
          externalIdentifier: 'externalId',
          internalIdentifier: '123',
          profileId: 'type',
          selectedJobProfileId: 'profileId',
        },
      });
      expect(mockProps.updateLocation).toHaveBeenCalledWith(
        {
          _path: '/inventory/view/123',
          layer: undefined,
          xid: undefined,
        },
        { replace: true }
      );
    });
  });

  it('handles failed API response correctly', async () => {
    const errorResponse = {
      status: 404,
      statusText: 'Not Found',
      text:() => 'Resource not found',
      headers: {
        get: jest.fn().mockResolvedValue('application/json')
      },
    };

    const error = new ky.HTTPError(errorResponse);

    mockProps.okapiKy.mockRejectedValue(error);

    renderWithIntl(renderWithRouter(
      <ImportRecord {...mockProps} />
    ));

    await waitFor(() => {
      expect(mockProps.okapiKy).toHaveBeenCalledWith('copycat/imports', expect.any(Object));
      expect(mockProps.updateLocation).toHaveBeenCalledWith(
        {
          _path: '/inventory/view/123',
          layer: undefined,
          xid: undefined,
        },
        { replace: true }
      );
    });
  });

  it('calls loadExternalRecord on mount with correct params and handles failure', async () => {
    const mockError = new Error('Request failed');
    mockProps.okapiKy.mockRejectedValue(mockError);

    renderWithIntl(renderWithRouter(
      <ImportRecord {...mockProps} />
    ));

    await waitFor(() => {
      expect(mockProps.okapiKy).toHaveBeenCalledWith('copycat/imports', expect.any(Object));
      expect(mockProps.updateLocation).toHaveBeenCalledWith(
        {
          _path: '/inventory/view/123',
          layer: undefined,
          xid: undefined,
        },
        { replace: true }
      );
    });
  });

  it('displays waiting screen during render', () => {
    const mockResponse = { internalIdentifier: 'newId' };
    mockProps.okapiKy.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockResponse) });

    const { getByText } = renderWithIntl(
      renderWithRouter(<ImportRecord {...mockProps} />),
      translationsProperties,
    );

    expect(
      getByText(
        'Importing this instance will take a few moments. A success message and updated details will be displayed upon completion.'
      )
    ).toBeInTheDocument();
  });
});
