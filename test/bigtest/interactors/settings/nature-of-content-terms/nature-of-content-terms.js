import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class NatureOfContentTerms {
  hasList = isPresent('#editList-natureOfContentTerms');
  rowCount = count('[class^="editListRow---"]');
  hasNewButton = isPresent('#clickable-add-natureOfContentTerms');
}

export default new NatureOfContentTerms();
