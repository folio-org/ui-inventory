import {
  interactor,
  scoped,
  collection,
  selectable,
  fillable,
  clickable,
  isPresent,
  isVisible,
} from '@bigtest/interactor';

import {
  MultiSelectFilterInteractor,
} from './filters';

@interactor class InventoryHeaderDropdownMenu {
  clickItemsInTransitReportBtn = clickable('#dropdown-clickable-get-report');
  itemsInTransitReportBtnIsVisible = isVisible('#dropdown-clickable-get-report');
  clickSaveInstancesUIIDsBtn = clickable('#dropdown-clickable-get-items-uiids');
  saveInstancesUIIDsBtnIsVisible = isVisible('#dropdown-clickable-get-items-uiids');
}

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');

  isResourceFilterPresent = isPresent('[data-test-filter-instance-resource]');
  isLocationFilterPresent = isPresent('[data-test-filter-instance-location]');
  isEffectiveLocationFilterPresent = isPresent('#effectiveLocation');
  isStaffSuppressFilterPresent = isPresent('[data-test-filter-instance-staff-suppress]');
  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-instance-discovery-suppress]');
  clickSelectStaffSuppressFilter = clickable('#clickable-filter-staffSuppress-true');
  clickClearStaffSuppressFilter = clickable('#staffSuppress button[class^="iconButton---"]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-discoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#discoverySuppress button[class^="iconButton---"]');

  instances = collection('#list-inventory [role=row] a');

  instance = scoped('[data-test-instance-details]');
  chooseSearchOption = selectable('#input-inventory-search-qindex');

  fillSearchField = fillable('#input-inventory-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');

  clickOnTextResourceTypeFilter = clickable('#clickable-filter-resource-text');
  clikckOnAnnexLocationFilter = clickable('#clickable-filter-location-annex');

  openInstance = clickable('[role=row] a');
  openItem = clickable('[data-test-items] a');
  closeItem = clickable('[data-test-item-view-page] button:first-child');

  headerDropdown = scoped('[class*=paneHeaderCenterInner---] [class*=dropdown---] button');
  headerDropdownMenu = new InventoryHeaderDropdownMenu();

  resourceTypeFilter = scoped('#resource', MultiSelectFilterInteractor);
  formatFilter = scoped('#format', MultiSelectFilterInteractor)
}
