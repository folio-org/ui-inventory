import {
  interactor,
  isPresent,
  text,
  clickable,
} from '@bigtest/interactor';

@interactor class InstanceMovementDetails {
  isLoaded = isPresent('[data-test-pane-header-title]');

  whenLoaded() {
    return this.timeout(10000).when(() => this.isLoaded);
  }

  title = text('[data-test-pane-header-title]');
  close = clickable('[data-test-pane-header-dismiss-button]');
}

export default InstanceMovementDetails;
