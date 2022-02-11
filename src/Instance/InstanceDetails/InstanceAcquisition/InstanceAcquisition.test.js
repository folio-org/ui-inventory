import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import { resultData, line } from './fixtures';
import InstanceAcquisition from './InstanceAcquisition';
import useInstanceAcquisition from './useInstanceAcquisition';

jest.mock('./useInstanceAcquisition', () => jest.fn());

const renderInstanceAcquisition = ({
  instanceId,
} = {}) => (
  renderWithIntl(
    <Router>
      <InstanceAcquisition instanceId={instanceId} />
    </Router>
  )
);

describe('InstanceAcquisition', () => {
  beforeEach(() => {
    useInstanceAcquisition.mockClear().mockReturnValue({ instanceAcquisition: resultData });
  });

  it('should display fetched instance acquisition data', () => {
    renderInstanceAcquisition('instanceId');

    expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
  });
});
