import {
  interactor,
  clickable,
  text,
  isPresent,
  property,
  attribute,
  count,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('#cancel-instance-edition');
}

@interactor class Classifications {
  firstOptionText = text('option:nth-of-type(1)')
  firstOptionIsDisabled = property('option:nth-of-type(1)', 'disabled');
}

@interactor class Formats {
  firstOptionText = text('option:nth-of-type(1)')
  firstOptionIsDisabled = property('option:nth-of-type(1)', 'disabled');
}

@interactor class Languages {
  firstOptionText = text('option:nth-of-type(1)')
  firstOptionIsDisabled = property('option:nth-of-type(1)', 'disabled');
}

@interactor class Contributors {
  contributorCount = count('[data-test-repeater-field-row]')
  makeFirstContributorPrimary = clickable('button[data-test-primary-toggle-button]');
  firstContributorIsPrimary = isPresent('button[data-test-primary-toggle-button][class*=primary---]')
  clickAddNewContributor = clickable('#clickable-add-contributor');
}

@interactor class PrecedingTitles {
  precedingTitlesCount = count('[data-test-repeater-field-row]');
  clickAddPrecedingTitle = clickable('#clickable-add-precedingTitle-add-button');
  clickAddInstance = clickable('[data-test-plugin-find-record-button]');
  instanceName = text('[data-test-connected-instance-title]');
}

@interactor class Foo { }

@interactor class InstanceEditPage {
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();

  classifications = new Classifications('select[name="classifications[0].classificationTypeId"]');
  clickAddClassification = clickable('#clickable-add-classification');
  firstClassificationLabelId = attribute('[data-test-instance-format-field-count="0"]', 'aria-labelledby');
  secondClassificationLabelId = attribute('[data-test-instance-format-field-count="1"]', 'aria-labelledby');
  firstClassificationFieldExists = isPresent('[data-test-instance-format-field-count="0"]');
  secondClassificationFieldExists = isPresent('[data-test-instance-format-field-count="1"]');

  formats = new Formats('select[name="instanceFormatIds[0]"]');
  clickAddFormat = clickable('#clickable-add-instanceformat');
  firstFormatLabelId = attribute('[data-test-instance-format-field-count="0"]', 'aria-labelledby');
  secondFormatLabelId = attribute('[data-test-instance-format-field-count="1"]', 'aria-labelledby');
  firstFormatFieldExists = isPresent('[data-test-instance-format-field-count="0"]');
  secondFormatFieldExists = isPresent('[data-test-instance-format-field-count="1"]');

  languages = new Languages('select[name="languages[0]"]');
  clickAddLanguage = clickable('#clickable-add-language');
  firstLanguageFieldExists = isPresent('[data-test-language-field-count="0"]');
  firstLanguageLabelId = attribute('[data-test-language-field-count="0"]', 'aria-labelledby');
  secondLanguageFieldExists = isPresent('[data-test-language-field-count="1"]');
  secondLanguageLabelId = attribute('[data-test-language-field-count="1"]', 'aria-labelledby');

  contributors = new Contributors();
  precedingTitles = new PrecedingTitles();

  // The BigTest documentation shows examples like
  //   let input = new Interactor('input');
  // but that generates fun fun Webpack errors like
  //   TypeError: _bigtest_interactor__WEBPACK_IMPORTED_MODULE_2__.default is not a constructor
  // so I gave up and made my own constructor. Does this suck? Yes, yes it does.
  // Do I care? After a day fighting with BigTest, No, no I do not.
  newI(sel) {
    return new Foo(`#${sel}`);
  }
}

export default new InstanceEditPage({
  scope: '[data-test-instance-page-type="edit"]',
  timeout: 4000,
});
