import {
  interactor,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

@interactor class SelectedRecordsModalInteractor {
  static defaultScope = '[data-test-selected-records-modal]';

  cancelButton = new ButtonInteractor('[data-test-selected-records-cancel]');
  selectedRecordsList = new MultiColumnListInteractor('#selected-records-list');
}

export default SelectedRecordsModalInteractor;
