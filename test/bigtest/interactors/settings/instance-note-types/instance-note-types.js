import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class InstanceNoteTypes {
  hasList = isPresent('#editList-instanceNoteTypes');
  hasCreateButton = isPresent('#clickable-add-instanceNoteTypes');
  hasEditButton = isPresent('#clickable-edit-instanceNoteTypes-0');
  hasDeleteButton = isPresent('#clickable-delete-instanceNoteTypes-0');
  rowCount = count('[class^="editListRow---"]');
}

export default new InstanceNoteTypes();
