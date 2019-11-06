import {
  interactor,
  clickable,
  collection,
} from '@bigtest/interactor';

// eslint-disable-next-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';

export default @interactor class ItemsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';
  openMaterialTypeFilter = clickable('#accordion-toggle-button-materialTypeAccordion');
  materialTypeFilter = new MultiSelectInteractor('#materialTypeFilter');
  rows = collection('#list-inventory [data-row-index]');
}
