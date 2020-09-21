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
  defaultInstanceStatusReadOnly = property('select[name="instanceStatusCode"] option:last-child', 'disabled');
  defaultDiscoverySuppressReadOnly = property('select[name="defaultDiscoverySuppress"] option', 'disabled');
}

export default new FastAddSettingsInteractor();
