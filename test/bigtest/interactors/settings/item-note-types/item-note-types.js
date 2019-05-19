import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ItemNoteTypes {
  hasList = isPresent('#editList-itemNoteTypes');
  rowCount = count('[class^="editListRow---"]');
}

export default new ItemNoteTypes();
