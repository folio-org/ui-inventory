import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ClassificationTypes {
  hasList = isPresent('#editList-classification-types');
  rowCount = count('[class^="editListRow---"]');
}

export default new ClassificationTypes();
