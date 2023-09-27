import React from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { instance } from '../../../../test/fixtures';

import ConsortialHoldings from './ConsortialHoldings';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockReturnValue({ consortiaTenants: [{ id: 'tenant-id', name: 'tenant-name', isCentral: false }] })
}));
jest.mock('../MemberTenantHoldings', () => ({
  // ...jest.requireActual('../MemberTenantHoldings'),
  MemberTenantHoldings: () => <>MemberTenantHoldings</>,
}));

const renderConsortialHoldings = () => {
  return renderWithIntl(
    <ConsortialHoldings instance={instance} />,
    translationsProperties,
  );
};

describe('ConsortialHoldings', () => {
  it('should render accordion', () => {
    renderConsortialHoldings();

    screen.debug();

    expect(screen.getByRole('button', { name: 'Consortial holdings' })).toBeInTheDocument();
  });
});
