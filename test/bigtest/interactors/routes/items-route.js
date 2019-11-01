import {
  interactor,
} from '@bigtest/interactor';

// eslint-disable-next-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';

export default @interactor class ItemsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  materialTypeFilter = new MultiSelectInteractor('#materialTypeFilter');
}
