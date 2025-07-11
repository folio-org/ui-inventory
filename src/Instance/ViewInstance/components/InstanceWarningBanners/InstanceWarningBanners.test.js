import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../../../../test/jest/helpers';

import InstanceWarningBanners from './InstanceWarningBanners';

const renderInstanceWarningBanners = (instance) => {
  return renderWithIntl(<InstanceWarningBanners instance={instance} />, translationsProperties);
};

describe('InstanceWarningBanners', () => {
  it('renders staff suppressed warning', () => {
    renderInstanceWarningBanners({ deleted: false, staffSuppress: true, discoverySuppress: false });

    expect(screen.getByText('Warning: Instance is marked staff suppressed')).toBeInTheDocument();
  });

  it('renders suppressed from discovery warning', () => {
    renderInstanceWarningBanners({ deleted: false, staffSuppress: false, discoverySuppress: true });

    expect(screen.getByText('Warning: Instance is marked suppressed from discovery')).toBeInTheDocument();
  });

  it('renders suppressed from discovery and staff suppressed warning', () => {
    renderInstanceWarningBanners({ deleted: false, staffSuppress: true, discoverySuppress: true });

    expect(screen.getByText('Warning: Instance is marked suppressed from discovery and staff suppressed')).toBeInTheDocument();
  });

  it('renders set for deletion and suppressed from discovery and staff suppressed warning', () => {
    renderInstanceWarningBanners({ deleted: true, staffSuppress: true, discoverySuppress: true });

    expect(screen.getByText('Warning: , suppressed from discovery, and staff suppressed')).toBeInTheDocument();
    expect(screen.getByText('Instance is set for deletion')).toBeInTheDocument();
  });

  it('renders no banners if no conditions are met', () => {
    renderInstanceWarningBanners({ deleted: false, staffSuppress: false, discoverySuppress: false });

    expect(screen.queryByText(/Warning:/)).not.toBeInTheDocument();
  });
});
