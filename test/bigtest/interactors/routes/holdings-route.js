import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class HoldingsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  isStaffSuppressFilterPresent = isPresent('[data-test-filter-holding-staff-suppress]');
  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-holding-discovery-suppress]');
  clickSelectStaffSuppressFilter = clickable('#clickable-filter-holding-staffSuppress-true');
  clickClearStaffSuppressFilter = clickable('#holdingStaffSuppress button[class^="iconButton---"]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-holdingDiscoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#holdingDiscoverySuppress button[class^="iconButton---"]');

}
