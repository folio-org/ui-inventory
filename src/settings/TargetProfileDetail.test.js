import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../test/jest/helpers';

import TargetProfileDetail from './TargetProfileDetail';

const identifierTypeResources = {
  identifierType: {
    records: [{ name: 'identifierTypeTestName' }],
    other: { totalRecords: 1 },
    hasLoaded: true,
  },
};
const defaultCreateJobProfileResources = {
  records: [{
    id: 'createJobProfileTestId',
    name: 'create name',
  }],
  other: { totalRecords: null },
  hasLoaded: true,
};
const defaultUpdateJobProfileResources = {
  records: [{
    id: 'updateJobProfileTestId',
    name: 'update name',
  }],
  other: { totalRecords: null },
  hasLoaded: true,
};
const allowedCreateJobProfilesResources = {
  jobProfiles: {
    records: [{
      id: 'createJobProfileTestId',
      name: 'create name',
    }],
    other: { totalRecords: 1 },
    hasLoaded: true,
  },
};
const allowedUpdateJobProfilesResources = {
  jobProfiles: {
    records: [{
      id: 'updateJobProfileTestId',
      name: 'update name',
    }],
    other: { totalRecords: 1 },
    hasLoaded: true,
  },
};
const resources = {
  identifierType: identifierTypeResources.identifierType,
  defaultCreateJobProfile: defaultCreateJobProfileResources,
  defaultUpdateJobProfile: defaultUpdateJobProfileResources,
  allowedCreateJobProfiles: allowedCreateJobProfilesResources.jobProfiles,
  allowedUpdateJobProfiles: allowedUpdateJobProfilesResources.jobProfiles,
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

const renderTargetProfileDetail = (initialValues = defaultInitialValues) => renderWithIntl(
  <BrowserRouter>
    <TargetProfileDetail
      initialValues={initialValues}
      resources={resources}
    />
  </BrowserRouter>,
  translationsProperties,
);

describe('TargetProfileDetail', () => {
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

    expect(getByText('create name').href).toContain('/settings/data-import/job-profiles/view/createJobProfileTestId');
    expect(getByText('update name').href).toContain('/settings/data-import/job-profiles/view/updateJobProfileTestId');
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
