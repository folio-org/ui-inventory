import {
  interactor,
  isPresent,
  count,
} from '@bigtest/interactor';

@interactor class InstanceTypes {
  hasList = isPresent('#editList-instance-types');
  rowCount = count('[class^="editListRow---"]');
}

export default new InstanceTypes('form');
