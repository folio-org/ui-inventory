import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class InstanceTypes {
  hasList = isPresent('#editList-instance-types');
  rowCount = count('[class^="editListRow---"]');
  hasNewButton = isPresent('#clickable-add-instance-types');
}

export default new InstanceTypes();
