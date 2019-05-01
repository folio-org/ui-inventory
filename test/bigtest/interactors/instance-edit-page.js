import {
  interactor,
  clickable,
  text,
  selectable,
  isPresent
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('#cancel-instance-edition');
}

@interactor class AddFormatButton {
  click = clickable('#clickable-add-instanceformat');
}

@interactor class SelectFormat {
  exists = isPresent('select[name="instanceFormatIds[0]"]')
  select = selectable('select[name="instanceFormatIds[0]"]');
  firstOptionText = text('select[name="instanceFormatIds[0]"] option:nth-of-type(1)')
}

@interactor class AddLanguageButton {
  click = clickable('#clickable-add-language');
}

@interactor class SelectLanguage {
  exists = isPresent('select[name="languages[0]"]');
  select = selectable('select[name="languages[0]"]');
  firstOptionText = text('select[name="languages[0]"] option:nth-of-type(1)')
}

@interactor class InstanceEditPage {
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();

  clickAddFormatButton = new AddFormatButton();
  clickAddLanguageButton = new AddLanguageButton();

  selectFormat = new SelectFormat();
  selectLanguage = new SelectLanguage();
}

export default new InstanceEditPage('[data-test-instance-page-type="edit"]');
