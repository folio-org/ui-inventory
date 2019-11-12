import {
  clickable,
  text,
  hasClass
} from '@bigtest/interactor';

import {
  labelArea,
  content,
  expanded,
} from '@folio/stripes-components/lib/Accordion/Accordion.css';
import CheckboxInteractor from '@folio/stripes-smart-components/lib/SearchAndSort/components/CheckboxFilter/tests/interactor';

export default class CheckboxFilterInteractor {
  static defaultScope = '[data-test-accordion-section]';

  label = text(`.${labelArea}`);
  isOpen = hasClass(`.${content}`, expanded);

  clear = clickable('button[icon="times-circle-solid"]');
  open = clickable('[id*="accordion-toggle-button-"]');

  checkboxes = new CheckboxInteractor();
}
