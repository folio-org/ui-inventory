import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class InstanceNoteTypes {
  hasList = isPresent('#editList-instanceNoteTypes');
  rowCount = count('[class^="editListRow---"]');
}

export default new InstanceNoteTypes();
