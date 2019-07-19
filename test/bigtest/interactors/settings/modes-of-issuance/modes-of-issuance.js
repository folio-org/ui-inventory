import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class ModesOfIssuance {
  hasList = isPresent('#editList-modes-of-issuance');
  rowCount = count('[class^="editListRow---"]');
}

export default new ModesOfIssuance();
