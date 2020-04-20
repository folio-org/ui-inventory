import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

@interactor class HoldingsCreatePage {
  title = text('[data-test-header-title]');
  clickCancel = clickable('#cancel-holdings-creation');
}

export default new HoldingsCreatePage('[data-test-holdings-page-type="create"]');
