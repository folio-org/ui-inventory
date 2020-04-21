import {
  interactor,
  clickable,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class HoldingsEditPage {
  isLoaded = isPresent('[data-test-holdings-page-type="edit"]');

  title = text('[data-test-header-title]');
  clickCancel = clickable('#cancel-holdings-creation');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsEditPage({ timeout: 6000 });
