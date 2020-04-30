import {
  clickable,
  fillable,
  interactor,
} from '@bigtest/interactor';

export default @interactor class DateRangeFilterInteractor {
  clear = clickable('button[icon="times-circle-solid"]');
  open = clickable('[id*="accordion-toggle-button-"]');
  fillStartDateInput = fillable('[data-test-date-input="startDate"]');
  fillEndDateInput = fillable('[data-test-date-input="endDate"]');
  clickApplyButton = clickable('[data-test-apply-button]');
}
