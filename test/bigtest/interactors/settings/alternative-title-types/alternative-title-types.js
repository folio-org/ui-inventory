import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class AlternativeTitleTypes {
  hasList = isPresent('#editList-alternative-title-types');
  hasEditButton = isPresent('#clickable-edit-alternative-title-types-0');
  hasDeleteButton = isPresent('#clickable-delete-alternative-title-types-0');
  hasNewButton = isPresent('#clickable-add-alternative-title-types');
  rowCount = count('[class^="editListRow---"]');
}

export default new AlternativeTitleTypes();
