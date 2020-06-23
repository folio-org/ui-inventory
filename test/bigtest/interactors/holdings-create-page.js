import {
  interactor,
  clickable,
  text,
  isPresent,
} from '@bigtest/interactor';

@interactor class HoldingsCreatePage {
  isLoaded = isPresent('[data-test-header-title]');

  title = text('[data-test-header-title]');
  clickCancel = clickable('#cancel-holdings-creation');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsCreatePage('[data-test-holdings-page-type="create"]');
