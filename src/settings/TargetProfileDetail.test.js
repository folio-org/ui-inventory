import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../test/jest/helpers';

import {
  useAllowedJobProfiles,
  useDefaultJobProfile,
} from '../common/hooks';

import TargetProfileDetail from './TargetProfileDetail';

jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  useDefaultJobProfile: jest.fn(),
  useAllowedJobProfiles: jest.fn(),
}));

const identifierTypeResources = {
  identifierType: {
    records: [{ name: 'identifierTypeTestName' }],
    other: { totalRecords: 1 },
    hasLoaded: true,
  },
};

const allowedCreateJobProfilesMock = {
  isLoading: false,
  allowedJobProfiles: [{
    id: 'testCreateId1',
    name: 'Create job porfile 1',
  }, {
    id: 'testCreateId2',
    name: 'Create job porfile 2',
  }]
};
const allowedUpdateJobProfilesMock = {
  isLoading: false,
  allowedJobProfiles: [{
    id: 'testUpdateId1',
    name: 'Update job porfile 1',
  }, {
    id: 'testUpdateId2',
    name: 'Update job porfile 2',
  }]
};

const defaultCreateJobProfileMock = {
  isLoading: false,
  defaultJobProfile: {
    id: 'testCreateId1',
    name: 'Create job porfile 1',
  }
};

const defaultUpdateJobProfileMock = {
  isLoading: false,
  defaultJobProfile: {
    id: 'testUpdateId1',
    name: 'Update job porfile 1',
  }
};

const resources = {
  identifierType: identifierTypeResources.identifierType,
};

const defaultInitialValues = {
  authentication: 'testAuth',
  displayName: 'testName',
  enabled: true,
  externalIdQueryMap: 'extIdTest',
  internalIdEmbedPath: 'intIdTest',
  name: 'testName',
  targetOptions: { key: 'testTargetOptionsKey' },
  url: 'testURL',
  allowedCreateJobProfileIds: ['createJobProfileTestId'],
  allowedUpdateJobProfileIds: ['updateJobProfileTestId'],
  createJobProfileId: 'createJobProfileTestId',
  updateJobProfileId: 'updateJobProfileTestId',
};

const queryClient = new QueryClient();

const renderTargetProfileDetail = (initialValues = defaultInitialValues) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TargetProfileDetail
        initialValues={initialValues}
        resources={resources}
      />
    </BrowserRouter>
  </QueryClientProvider>,
  translationsProperties,
);

describe('TargetProfileDetail', () => {
  beforeEach(() => {
    useAllowedJobProfiles
      .mockReturnValueOnce(allowedCreateJobProfilesMock)
      .mockReturnValueOnce(allowedUpdateJobProfilesMock);
    useDefaultJobProfile
      .mockReturnValueOnce(defaultCreateJobProfileMock)
      .mockReturnValueOnce(defaultUpdateJobProfileMock);
  });

  afterEach(() => {
    useAllowedJobProfiles.mockClear();
    useDefaultJobProfile.mockClear();
  });

  it('should display correct profile name', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Name')).toBeDefined();
    expect(getByText('testName')).toBeDefined();
  });

  it('should display correct URL', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('URL')).toBeDefined();
    expect(getByText('testURL')).toBeDefined();
  });

  it('should display correct Authentication', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Authentication')).toBeDefined();
    expect(getByText('testAuth')).toBeDefined();
  });

  it('should display correct External ID query map', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('External ID query map')).toBeDefined();
    expect(getByText('extIdTest')).toBeDefined();
  });

  it('should display correct Internal ID embed path', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Internal ID embed path')).toBeDefined();
    expect(getByText('intIdTest')).toBeDefined();
  });

  it('should display a table with Job profiles for import/create', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Job profiles for import/create')).toBeDefined();
  });

  it('should display a table with Job profiles for overlay/update', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Job profiles for import/create')).toBeDefined();
  });

  it('names of job profiles should be displayed in a correct format', () => {
    const { queryByText } = renderTargetProfileDetail();

    expect(queryByText('create name(createJobProfileTestId)')).toBeDefined();
    expect(queryByText('update name(updateJobProfileTestId)')).toBeDefined();
  });

  it('names of job profiles should be displayed as a hotlink', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Create job porfile 1').href).toContain('/settings/data-import/job-profiles/view/testCreateId1');
    expect(getByText('Update job porfile 1').href).toContain('/settings/data-import/job-profiles/view/testUpdateId1');
  });

  it('should display correct Target options', () => {
    const {
      getByText,
      queryByText,
    } = renderTargetProfileDetail();

    expect(getByText('Target options')).toBeDefined();
    expect(queryByText('key: testTargetOptionsKey')).toBeDefined();
  });

  it('should display correct External identifier type', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('External identifier type')).toBeDefined();
    expect(getByText('identifierTypeTestName')).toBeDefined();
  });

  it('should display a mark when Enabled is true', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('Enabled')).toBeDefined();
    expect(getByText('✓')).toBeDefined();
  });
});
