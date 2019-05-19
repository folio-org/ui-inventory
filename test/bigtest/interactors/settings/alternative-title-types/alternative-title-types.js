import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class AlternativeTitleTypes {
  hasList = isPresent('#editList-alternative-title-types');
  rowCount = count('[class^="editListRow---"]');
}

export default new AlternativeTitleTypes();
