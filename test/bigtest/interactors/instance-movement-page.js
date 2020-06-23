import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class InstanceMovementDetails {
  isLoaded = isPresent('[data-test-pane-header-title]');

  whenLoaded() {
    return this.timeout(10000).when(() => this.isLoaded);
  }

  title = text('[data-test-pane-header-title]');
}

export default InstanceMovementDetails;
