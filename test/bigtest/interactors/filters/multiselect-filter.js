// eslint-disable-next-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';
import FilterInteractor from './filter';

export default class MultiSelectFilterInteractor extends FilterInteractor {
  multiSelect = new MultiSelectInteractor('[class^="multiSelectContainer---"]');
}
