import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class HoldingsNoteTypes {
  hasList = isPresent('#editList-holdingsNoteTypes');
  rowCount = count('[class^="editListRow---"]');
}

export default new HoldingsNoteTypes();
