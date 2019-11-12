import {
  clickable,
  scoped,
  text,
  hasClass
} from '@bigtest/interactor';

import {
  labelArea,
  content,
  expanded,
} from '@folio/stripes-components/lib/Accordion/Accordion.css';
// eslint-disable-next-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor';

export default class MultiSelectFilterInteractor {
  static defaultScope = '[data-test-accordion-section]';

  label = text(`.${labelArea}`);
  isOpen = hasClass(`.${content}`, expanded);

  clear = clickable('button[icon="times-circle-solid"]');
  open = clickable('[id*="accordion-toggle-button-"]');

  multiSelect = scoped('[class^= "multiSelectContainer---"]', MultiSelectInteractor);
}
