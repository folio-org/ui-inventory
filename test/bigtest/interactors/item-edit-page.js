import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import PaneFooterInteractor from './pane-footer';

@interactor class ItemEditPage {
  isLoaded = isPresent('[data-test-header-title]');

  title = text('[data-test-header-title]');
  sub = text('[data-test-header-sub]');
  paneFooter = new PaneFooterInteractor();

  whenLoaded() {
    return this.timeout(6000).when(() => this.isLoaded);
  }
}

export default new ItemEditPage('[data-test-item-page-type="edit"]');
