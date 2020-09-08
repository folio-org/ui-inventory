import {
  interactor,
  property,
} from '@bigtest/interactor';

import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

@interactor class FastAddSettingsInteractor {
  static defaultScope = '[data-test-fast-add-settings-form]';

  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  cancelFormButtonDisabled = property('[data-test-cancel-button]', 'disabled');
  defaultInstanceStatus = new SelectInteractor('[data-test-default-instance-status] [class^="select---"]');
  defaultDiscoverySuppress = new SelectInteractor('[data-test-default-discovery-suppress] [class^="select---"]');
}

export default new FastAddSettingsInteractor();
