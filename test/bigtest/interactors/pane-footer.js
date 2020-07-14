import {
  interactor,
  clickable
} from '@bigtest/interactor';

@interactor class PaneFooterInteractor {
  clickCancel = clickable('[data-test-pane-footer-start] button');
  clickSave = clickable('[data-test-pane-footer-end] button');
}

export default PaneFooterInteractor;
