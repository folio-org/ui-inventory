import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class IdentifierTypes {
  hasList = isPresent('#editList-identifier-types');
  hasCreateButton = isPresent('#clickable-add-identifier-types');
  rowCount = count('[class^="editListRow---"]');
}

export default new IdentifierTypes();
