import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class HoldingsNoteTypes {
  hasList = isPresent('#editList-holdingsNoteTypes');
  hasCreateButton = isPresent('#clickable-add-holdingsNoteTypes');
  hasEditButton = isPresent('#clickable-edit-holdingsNoteTypes-0');
  hasDeleteButton = isPresent('#clickable-delete-holdingsNoteTypes-0');
  rowCount = count('[class^="editListRow---"]');
}

export default new HoldingsNoteTypes();
