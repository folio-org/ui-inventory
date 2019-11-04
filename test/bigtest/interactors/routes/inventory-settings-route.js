import { interactor, isPresent } from '@bigtest/interactor';

export default @interactor class InvSettingsRouteInteractor {
  static defaultScope = '[data-test-inventory-settings]';
  hasSectionItem = isPresent('[class^=NavListItem---]');
  hasInstance = isPresent('#ui-inventory.instances');
  hasAlternativeTitleInstance = isPresent('#alternative-title-types');
}
