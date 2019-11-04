import { interactor, isPresent } from '@bigtest/interactor';

export default @interactor class InventorySettingsRouteInteractor {
  static defaultScope = '[data-test-inventory-settings]';
  hasSectionItem = isPresent('[class^=NavListItem---]');
}
