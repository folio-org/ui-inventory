import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class NatureOfContentTerms {
  hasList = isPresent('#editList-natureOfContentTerms');
  rowCount = count('[class^="editListRow---"]');
}

export default new NatureOfContentTerms();
