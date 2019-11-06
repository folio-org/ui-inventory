import {
  interactor,
  clickable,
  text,
  hasClass
} from '@bigtest/interactor';

// eslint-disable-next-line
import {
  labelArea,
  content,
  expanded,
} from '@folio/stripes-components/lib/Accordion/Accordion.css';

export default @interactor class FilterInteractor {
  static defaultScope = '[data-test-accordion-section]';

  label = text(`.${labelArea}`);
  isOpen = hasClass(`.${content}`, expanded);

  clear = clickable('button[icon="times-circle-solid"]');
  open = clickable('[id*="accordion-toggle-button-"]');
}
