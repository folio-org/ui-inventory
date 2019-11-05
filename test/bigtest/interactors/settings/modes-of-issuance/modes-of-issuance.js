import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ModesOfIssuance {
  hasList = isPresent('#editList-modes-of-issuance');
  rowCount = count('[class^="editListRow---"]');
  hasCreateButton = isPresent('#clickable-add-modes-of-issuance');
}

export default new ModesOfIssuance();
