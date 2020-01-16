import {
  interactor,
  collection,
  property,
} from '@bigtest/interactor';
// eslint-disable-next-line
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
// eslint-disable-next-line
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

@interactor
class StartWithFieldInteractor {
  fields = collection('.startWithField', TextFieldInteractor);
  errorMessages = collection('[class*="feedbackError---"]');
}

@interactor
class AssignPrefixFieldInteractor {
  fields = collection('.assignPrefixField', TextFieldInteractor);
  errorMessages = collection('[class*="feedbackError---"]');
}

@interactor class HRIDHandlingInteractor {
  static defaultScope = '[data-test-hrid-handling-form]';

  submitFormButton = new ButtonInteractor('[data-test-submit-button]');
  cancelFormButton = new ButtonInteractor('[data-test-cancel-button]');
  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  cancelFormButtonDisabled = property('[data-test-cancel-button]', 'disabled');
  startWithFields = new StartWithFieldInteractor();
  assignPrefixFields = new AssignPrefixFieldInteractor();
  callout = new CalloutInteractor();
  confirmationModal = new ConfirmationModalInteractor('#confirm-edit-hrid-settings-modal');
}

export default new HRIDHandlingInteractor();
