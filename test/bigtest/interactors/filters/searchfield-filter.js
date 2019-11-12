import {
  interactor,
  clickable,
} from '@bigtest/interactor';

import SearchFieldInteractor from '@folio/stripes-components/lib/SearchField/tests/interactor';

export default @interactor class SearchFieldFilterInteractor {
  searchField = new SearchFieldInteractor();
  clickSearch = clickable('[data-test-search-and-sort-submit]');
}
