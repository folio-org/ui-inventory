import {
  interactor,
  scoped,
  collection,
  selectable,
  fillable,
  clickable,
  isPresent,
  isVisible,
  property,
  Interactor,
} from '@bigtest/interactor';

import DateRangeFilterInteractor from '@folio/stripes-smart-components/lib/SearchAndSort/components/DateRangeFilter/tests/interactor';

import {
  MultiSelectFilterInteractor,
} from './filters';

@interactor class InventoryHeaderDropdownMenu {
  clickNewInstanceBtn = clickable('#clickable-newinventory');
  clickItemsInTransitReportBtn = clickable('#dropdown-clickable-get-report');
  itemsInTransitReportBtnIsVisible = isVisible('#dropdown-clickable-get-report');
  clickSaveInstancesUIIDsBtn = clickable('#dropdown-clickable-get-items-uiids');
  saveInstancesUIIDsBtnIsVisible = isVisible('#dropdown-clickable-get-items-uiids');
  isSaveInstancesUIIDsBtnDisabled = property('#dropdown-clickable-get-items-uiids', 'disabled');
  isSaveInstancesUIIDsIconPresent = isPresent('#dropdown-clickable-get-items-uiids [class*=icon-save]');
  saveInstancesCQLQueryBtn = new Interactor('#dropdown-clickable-get-cql-query');
  isSaveInstancesCQLQueryDisabled = property('#dropdown-clickable-get-cql-query', 'disabled');
  isSaveInstancesCQLQueryIconPresent = isPresent('#dropdown-clickable-get-cql-query [class*=icon-search]');
  isTransitItemsReportIconPresent = isPresent('#dropdown-clickable-get-report [class*=icon-report]');
  exportInstancesMARCBtnIsVisible = isVisible('#dropdown-clickable-export-marc');
  isExportInstancesMARCBtnDisabled = property('#dropdown-clickable-export-marc', 'disabled');
  isExportInstancesMARCIconPresent = isPresent('#dropdown-clickable-export-marc [class*=icon-download]');
  exportInstancesJSONBtnIsVisible = isVisible('#dropdown-clickable-export-json');
  isExportInstancesJSONBtnDisabled = property('#dropdown-clickable-export-json', 'disabled');
  isExportInstancesJSONIconPresent = isPresent('#dropdown-clickable-export-json [class*=icon-download]');
}

@interactor class CreatedDateFilterInteractor {
  static defaultScope = '#createdDate';

  clear = clickable('button[icon="times-circle-solid"]');
  open = clickable('[id*="accordion-toggle-button-"]');
  filter = new DateRangeFilterInteractor();
}

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');

  isResourceFilterPresent = isPresent('#resource');
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

  headerDropdown = scoped('[data-test-pane-header-actions-button]');
  headerDropdownMenu = new InventoryHeaderDropdownMenu();

  resourceTypeFilter = scoped('#resource', MultiSelectFilterInteractor);
  formatFilter = scoped('#format', MultiSelectFilterInteractor);
  modeFilter = scoped('#mode', MultiSelectFilterInteractor);
  createdDate = new CreatedDateFilterInteractor();

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}
