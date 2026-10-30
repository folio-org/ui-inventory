import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import HoldingsMarcContainer from './HoldingsMarcContainer';

jest.mock('../../components/ViewSource/ViewSource', () => jest.fn().mockReturnValue('ViewSource'));

describe('HoldingsMarcContainer', () => {
  const mutator = {
    marcInstance: {
      GET: jest.fn(),
    },
    marcRecord: {
      GET: jest.fn(),
    },
  };

  const instanceId = '123';
  const holdingsrecordid = '456';

  it('should render a loading indicator when holdings data is loading', () => {
    render(
      <MemoryRouter>
        <HoldingsMarcContainer mutator={mutator} holdingsrecordid={holdingsrecordid} instanceId={instanceId} />
      </MemoryRouter>
    );
    expect(screen.getByText('ViewSource')).toBeInTheDocument();
  });
});
