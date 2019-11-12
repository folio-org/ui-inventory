import { scoped } from '@bigtest/interactor';

// eslint-disable-next-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';
import filterInteractor from './filter';

export default @filterInteractor class MultiSelectFilterInteractor {
  multiSelect = scoped('[class^= "multiSelectContainer---"]', MultiSelectInteractor);
}
