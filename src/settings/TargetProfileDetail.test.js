import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl
} from '../../test/jest/helpers';

import TragetProfileDetail from './TargetProfileDetail';

const defaultProps = {
  initialValues : {
    name: 'testname',
    url: 'testURL',
    authentication: 'null',
    externalIdQueryMap: 'null',
    internalIdEmbedPath: 'null',
    createJobProfileId: 'null',
    updateJobProfileId: 'null',
    targetOptions: 'null',
    enabled: false,
  }
};
const TargetProfileDetailSetup = () => (
  <MemoryRouter>
    <TragetProfileDetail {...defaultProps} />
  </MemoryRouter>
);

const renderTargetProfileDetail = () => renderWithIntl(
  <TargetProfileDetailSetup />
);

describe('TargetProfileDetails', () => {
  it('should display all label', () => {
    const { container } = renderTargetProfileDetail();
    expect(container.getElementsByClassName('kvLabel').length).toBe(10);
  });
  it('checking by specific label', () => {
    renderTargetProfileDetail();
    Object.keys(defaultProps.initialValues).forEach(element => {
      expect(screen.getByText('ui-inventory.' + element)).toBeInTheDocument();
    });
  });
});
