import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import { resultData, line } from './fixtures';
import InstanceAcquisition from './InstanceAcquisition';
import useInstanceAcquisition from './useInstanceAcquisition';

jest.mock('./useInstanceAcquisition', () => jest.fn());

const renderInstanceAcquisition = (props = {}) => (
  renderWithIntl(
    <Router>
      <InstanceAcquisition
        instanceId="instanceId"
        accordionId="accordionId"
        {...props}
      />
    </Router>
  )
);

describe('InstanceAcquisition', () => {
  beforeEach(() => {
    useInstanceAcquisition.mockClear().mockReturnValue({ instanceAcquisition: resultData });
  });

  it('should display fetched instance acquisition data', () => {
    renderInstanceAcquisition({ instanceId: 'instanceId' });

    expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
  });
});
