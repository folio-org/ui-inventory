import {
  interactor,
  clickable,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class HoldingsEditPage {
  isLoaded = isPresent('[data-test-holdings-page-type="edit"]');

  title = text('[data-test-holdings-page-type="edit"] [data-test-header-title]');
  clickCancel = clickable('#cancel-holdings-creation');
  holdingSourcePresent = isPresent('#additem_holdingsSource');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsEditPage({ timeout: 6000 });
