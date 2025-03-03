import React from 'react';
import {
  BrowserRouter as Router,
  useHistory,
} from 'react-router-dom';

import {
  act,
  screen,
  waitFor,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';
import ViewSource from './ViewSource';
import useGoBack from '../../common/hooks/useGoBack';
import {
  useAuditSettings,
  useQuickExport,
} from '../../hooks';
import { CONSORTIUM_PREFIX } from '../../constants';
import MARC_TYPES from './marcTypes';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
jest.mock('../../common/hooks/useGoBack', () => jest.fn());
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useQuickExport: jest.fn().mockReturnValue({
    exportRecords: jest.fn(),
  }),
  useAuditSettings: jest.fn().mockReturnValue({
    settings: [{
      key: 'enabled',
      value: true,
    }],
    isSettingsLoading: false,
  }),
}));

const mutator = {
  marcRecord: {
    GET: jest.fn().mockResolvedValue({}),
  },
};

const mockGoBack = jest.fn();
const mockPush = jest.fn();
const mockExportRecords = jest.fn().mockResolvedValue({});
const mockInstance = {
  id: 'instance-id',
  title: 'Instance title',
  tenantId: 'tenantId',
  shared: false,
};

const getViewSource = (props = {}) => (
  <Router>
    <ViewSource
      mutator={mutator}
      instanceId="instance-id"
      holdingsRecordId="holdings-record-id"
      instance={mockInstance}
      isInstanceLoading={false}
      marcType={MARC_TYPES.BIB}
      {...props}
    />
  </Router>
);

describe('ViewSource', () => {
  beforeEach(() => {
    useHistory.mockClear().mockReturnValue({
      push: mockPush,
    });
    useGoBack.mockReturnValue(mockGoBack);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when data is loading', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource({ instance: null, isInstanceLoading: true }), translations);
      });
    });

    it('should render LoadingView', () => {
      expect(screen.getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('when marc source request is failed', () => {
    beforeEach(async () => {
      mutator.marcRecord.GET.mockRejectedValueOnce('marcRecord error');

      await act(async () => {
        await renderWithIntl(getViewSource({ instance: null, isInstanceLoading: true }), translations);
      });
    });

    it('should call goBack', () => {
      expect(mockGoBack).toBeCalledTimes(1);
    });
  });

  describe('when data is loaded', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should render MarcView', () => {
      expect(screen.getByText('MarcView')).toBeInTheDocument();
    });

    it('should initiate useGoBack with correct path', () => {
      expect(useGoBack).toBeCalledWith('/inventory/view/instance-id');
    });

    describe('when MarcView is closed', () => {
      it('should call onClose with correct url', async () => {
        await waitFor(() => expect(screen.getByText('MarcView')).toBeInTheDocument());
        act(() => fireEvent.click(screen.getByText('MarcView')));
        expect(mockGoBack).toBeCalledTimes(1);
      });
    });
  });

  describe('when tenantId provided', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource({ tenantId: 'tenantId' }), translations);
      });
    });

    it('should set correct header to request', () => {
      expect(mutator.marcRecord.GET).toHaveBeenCalledWith({ headers: expect.objectContaining({ 'X-Okapi-Tenant': 'tenantId' }) });
    });
  });

  describe('when Instance is shared', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource({
          instance: {
            title: 'Instance title',
            source: `${CONSORTIUM_PREFIX}MARC`,
            shared: true,
          },
        }), translations);
      });
    });

    it('should display "shared marc bibliographic record" message', () => {
      expect(screen.getByText('Shared MARC bibliographic record')).toBeInTheDocument();
    });
  });

  describe('when Instance is local', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource({
          instance: {
            title: 'Instance title',
            source: 'MARC',
            shared: false,
          },
        }), translations);
      });
    });

    it('should display "local marc bibliographic record" message', () => {
      expect(screen.getByText('Local MARC bibliographic record')).toBeInTheDocument();
    });
  });

  describe('when using an editMARC shortcut', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should redirect to marc edit page', () => {
      fireEvent.click(screen.getByRole('button', { name: 'editMARC' }));

      expect(mockPush).toHaveBeenLastCalledWith({
        pathname: `/inventory/quick-marc/edit-bibliographic/${mockInstance.id}`,
        search: '',
      });
    });
  });

  describe('action menu', () => {
    beforeEach(async () => {
      useQuickExport.mockClear().mockReturnValue({
        exportRecords: mockExportRecords,
      });
      await act(async () => {
        await renderWithIntl(getViewSource(), translations);
      });
    });

    it('should render actions', () => {
      expect(screen.getByText('Edit MARC bibliographic record')).toBeInTheDocument();
      expect(screen.getByText('Export instance (MARC)')).toBeInTheDocument();
      expect(screen.getByText('Print')).toBeInTheDocument();
    });

    describe('when clicking on Edit', () => {
      it('should redirect to marc edit page', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Edit MARC bibliographic record' }));

        expect(mockPush).toHaveBeenLastCalledWith({
          pathname: `/inventory/quick-marc/edit-bibliographic/${mockInstance.id}`,
          search: '',
        });
      });
    });

    describe('when clicking on Export', () => {
      it('should start record export', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Export instance (MARC)' }));

        expect(mockExportRecords).toHaveBeenLastCalledWith({
          uuids: [mockInstance.id],
          recordType: 'INSTANCE',
        });
      });
    });
  });

  describe('when clicking on the version history icon', () => {
    beforeEach(async () => {
      await act(async () => {
        await renderWithIntl(getViewSource(), []);
      });
    });

    it('should open the version history pane', () => {
      fireEvent.click(screen.getByLabelText('stripes-acq-components.versionHistory.pane.header'));

      expect(screen.getByText('stripes-components.versionHistory.pane.sub')).toBeInTheDocument();
    });
  });

  describe('when version history is disabled', () => {
    beforeEach(async () => {
      useAuditSettings.mockClear().mockReturnValue({
        settings: [{
          key: 'enabled',
          value: false,
        }],
        isSettingsLoading: false,
      });

      await act(async () => {
        await renderWithIntl(getViewSource(), []);
      });
    });

    it('should not show the version history button', () => {
      expect(screen.queryByLabelText('stripes-acq-components.versionHistory.pane.header')).not.toBeInTheDocument();
    });
  });
});
