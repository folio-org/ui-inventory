import {
  interactor,
  scoped,
} from '@bigtest/interactor';

@interactor class KeyValue {
  label = scoped('div');
  value = scoped('div:nth-child(2)');
}

export default KeyValue;
