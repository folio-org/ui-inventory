import {
  interactor,
  isPresent,
  clickable,
  collection,
} from '@bigtest/interactor';

@interactor class InstanceMarcPage {
  static defaultScope = '[data-test-instance-marc]';

  isLoaded = isPresent('[data-test-pane-header-title]');

  whenLoaded() {
    return this.timeout(10000).when(() => this.isLoaded);
  }

  fields = collection('[data-test-instance-marc-field]');
  close = clickable('[data-test-pane-header-dismiss-button]');
}

export default InstanceMarcPage;
