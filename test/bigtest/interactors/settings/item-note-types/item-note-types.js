import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ItemNoteTypes {
  hasList = isPresent('#editList-itemNoteTypes');
  rowCount = count('[class^="editListRow---"]');
  hasCreateButton = isPresent('#clickable-add-itemNoteTypes');
  hasEditButton = isPresent('#clickable-edit-itemNoteTypes-0');
  hasDeleteButton = isPresent('#clickable-delete-itemNoteTypes-0');
}

export default new ItemNoteTypes();
