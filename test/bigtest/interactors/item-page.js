import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class ItemPageInteractor {
  static defaultScope = '[data-test-item-view-page]';

  isLoaded = isPresent('[data-test-header-item-title]');
  closeItem = clickable('button[data-test-pane-header-dismiss-button]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}
