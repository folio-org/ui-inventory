import {
  interactor,
  clickable,
  text,
  selectable,
  isPresent,
  property,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('#cancel-instance-edition');
}

@interactor class Classifications {
  clickAddButton = clickable('#clickable-add-classification');
  idTypeMenu = isPresent('select[name="classifications[0].classificationTypeId"]')
  select = selectable('select[name="classifications[0].classificationTypeId"]');
  firstOptionText = text('select[name="classifications[0].classificationTypeId"] option:nth-of-type(1)')
  firstOptionIsDisabled = property('select[name="classifications[0].classificationTypeId"] option:nth-of-type(1)', 'disabled');
}

@interactor class Formats {
  clickAddButton = clickable('#clickable-add-instanceformat');
  formatMenu = isPresent('select[name="instanceFormatIds[0]"]')
  select = selectable('select[name="instanceFormatIds[0]"]');
  firstOptionText = text('select[name="instanceFormatIds[0]"] option:nth-of-type(1)')
}

@interactor class Languages {
  clickAddButton = clickable('#clickable-add-language');
  languageMenu = isPresent('select[name="languages[0]"]');
  select = selectable('select[name="languages[0]"]');
  firstOptionText = text('select[name="languages[0]"] option:nth-of-type(1)')
}

@interactor class InstanceEditPage {
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();

  classifications = new Classifications();
  formats = new Formats();
  languages = new Languages();
}

export default new InstanceEditPage('[data-test-instance-page-type="edit"]');
