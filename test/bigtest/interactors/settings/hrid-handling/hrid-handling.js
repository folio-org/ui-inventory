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
  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  startWithFields = new StartWithFieldInteractor();
  assignPrefixFields = new AssignPrefixFieldInteractor();
  callout = new CalloutInteractor();
}

export default new HRIDHandlingInteractor();
