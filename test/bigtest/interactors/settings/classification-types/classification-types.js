import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ClassificationTypes {
  hasList = isPresent('#editList-classification-types');
  rowCount = count('[class^="editListRow---"]');
  hasNewButton = isPresent('#clickable-add-classification-types');
}

export default new ClassificationTypes();
