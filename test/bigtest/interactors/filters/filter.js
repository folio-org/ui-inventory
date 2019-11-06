import {
  interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class FilterInteractor {
  clear = clickable('button[class^="iconButton---"]');
  open = clickable('button[class^="filterSetHeader---"]');
}
