import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class HoldingsSources {
  hasList = isPresent('#editList-holdingsSources');
  hasCreateButton = isPresent('#clickable-add-holdingsSources');
  hasEditButton = isPresent('#clickable-edit-holdingsSources-0');
  hasDeleteButton = isPresent('#clickable-delete-holdingsSources-0');
  rowCount = count('[class^="editListRow---"]');
}

export default new HoldingsSources();
