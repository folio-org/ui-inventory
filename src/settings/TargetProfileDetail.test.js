import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../test/jest/helpers';

import TargetProfileDetail from './TargetProfileDetail';

const resources = buildResources({
  resourceName: 'identifierType',
  records: [{ name: 'identifierTypeTestName' }],
});
const defaultInitialValues = {
  authentication: 'testAuth',
  displayName: 'testName',
  enabled: true,
  externalIdQueryMap: 'extIdTest',
  internalIdEmbedPath: 'intIdTest',
  name: 'testName',
  targetOptions: { key: 'testTargetOptionsKey '},
  url: 'testURL',
  createJobProfileIds: [{
    id: 'testId',
    name: 'create name',
    isDefault: true,
  }],
  updateJobProfileIds: [{
    id: 'testId',
    name: 'update name',
    isDefault: false,
  }],
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

    expect(queryByText('create name(testId)')).toBeDefined();
    expect(queryByText('update name(testId)')).toBeDefined();
  });

  it('names of job profiles should be displayed as a hotlink', () => {
    const { getByText } = renderTargetProfileDetail();

    expect(getByText('create name').href).toContain('/settings/data-import/job-profiles/view/testId');
    expect(getByText('update name').href).toContain('/settings/data-import/job-profiles/view/testId');
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
