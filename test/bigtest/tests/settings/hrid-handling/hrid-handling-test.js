import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HRIDHandlingInteractor from '../../../interactors/settings/hrid-handling/hrid-handling';
import translation from '../../../../../translations/ui-inventory/en';

const START_WITH_MAX_LENGTH = 11;
const ASSIGN_PREFIX_MAX_LENGTH = 10;
const checkInitialValues = () => {
  it('form has initialValues for startWith fields', () => {
    HRIDHandlingInteractor.startWithFields.fields().forEach(field => {
      expect(field.val).to.be.equal('00000000001');
    });
  });

  it('form has initialValues for assignPrefix fields', () => {
    expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).val).to.be.equal('in');
    expect(HRIDHandlingInteractor.assignPrefixFields.fields(1).val).to.be.equal('ho');
    expect(HRIDHandlingInteractor.assignPrefixFields.fields(2).val).to.be.equal('it');
  });
};

describe('Setting of HRID Handling', () => {
  setupApplication({ scenarios: ['fetch-hrid-settings-success'] });

  beforeEach(function () {
    this.visit('/settings/inventory/hridHandling');
  });

  it('renders', () => {
    expect(HRIDHandlingInteractor.isPresent).to.be.true;
  });

  it('has "remove leading zeroes" checkbox', () => {
    expect(HRIDHandlingInteractor.removeZeroesCheckbox.isPresent).to.be.true;
  });

  it('"remove leading zeroes" checkbox is unchecked by default', () => {
    expect(HRIDHandlingInteractor.removeZeroesCheckbox.isChecked).to.be.false;
  });

  it('has 3 startWith fields', () => {
    expect(HRIDHandlingInteractor.startWithFields.fields().length).to.be.equal(3);
  });

  it('has 3 assignPrefix fields', () => {
    expect(HRIDHandlingInteractor.assignPrefixFields.fields().length).to.be.equal(3);
  });

  it('has "Cancel" button at the bottom', () => {
    expect(HRIDHandlingInteractor.cancelFormButton.isPresent).to.be.true;
  });

  it('has "Save & close" button at the bottom', () => {
    expect(HRIDHandlingInteractor.submitFormButton.isPresent).to.be.true;
  });

  describe('when "remove leading zeroes" checkbox', () => {
    describe('is checked', () => {
      beforeEach(async () => {
        await HRIDHandlingInteractor.removeZeroesCheckbox.clickAndBlur();
      });

      it('leading zeroes should be removed for "start with" fields', () => {
        HRIDHandlingInteractor.startWithFields.fields().forEach(field => {
          expect(field.val).to.be.equal('1');
        });
      });
    });

    describe('is unchecked', () => {
      beforeEach(async () => {
        await HRIDHandlingInteractor.removeZeroesCheckbox.clickAndBlur();
        await HRIDHandlingInteractor.removeZeroesCheckbox.clickAndBlur();
      });

      it('leading zeroes should be added for "start with" fields', () => {
        HRIDHandlingInteractor.startWithFields.fields().forEach(field => {
          expect(field.val).to.be.equal('00000000001');
        });
      });
    });
  });

  describe('when is pristine', () => {
    it('the submit button is disabled', () => {
      expect(HRIDHandlingInteractor.submitFormButtonDisabled).to.be.true;
    });

    it('the cancel button is disabled', () => {
      expect(HRIDHandlingInteractor.cancelFormButtonDisabled).to.be.true;
    });

    checkInitialValues();
  });

  describe('when is changed correctly', () => {
    beforeEach(async () => {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillInput('0001');
      await HRIDHandlingInteractor.assignPrefixFields.fields(0).fillInput('it');
    });

    it('the submit button is not disabled', () => {
      expect(HRIDHandlingInteractor.submitFormButtonDisabled).to.be.false;
    });

    it('the cancel button is not disabled', () => {
      expect(HRIDHandlingInteractor.cancelFormButtonDisabled).to.be.false;
    });

    it('applies a changed class to fields', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).hasChangedStyle).to.be.true;
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).hasChangedStyle).to.be.true;
    });

    it('startWith field value should be equal to "0001"', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).val).to.be.equal('0001');
    });

    it('assignPrefix field value should be equal to "it"', () => {
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).val).to.be.equal('it');
    });
  });

  describe('when is changed', () => {
    beforeEach(async () => {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillInput('0001');
      await HRIDHandlingInteractor.assignPrefixFields.fields(0).fillInput('it');
    });

    describe('and "Cancel" button pressed', () => {
      beforeEach(async () => {
        await HRIDHandlingInteractor.cancelFormButton.click();
      });

      checkInitialValues();
    });
  });

  describe('when input a non numeric value to the startWith field', () => {
    beforeEach(async () => {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillAndBlur('fdg');
    });

    it('renders an error message', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).inputError).to.be.true;
    });

    it('with correct wording', () => {
      expect(HRIDHandlingInteractor.startWithFields.errorMessages(0).text)
        .to.be.equal(translation['hridHandling.validation.startWithField']);
    });
  });

  describe('when input special symbols to the assignPrefix field', () => {
    beforeEach(async () => {
      await HRIDHandlingInteractor.assignPrefixFields.fields(0).fillAndBlur('*');
    });

    it('renders an error message', () => {
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).inputError).to.be.true;
    });

    it('with correct wording', () => {
      expect(HRIDHandlingInteractor.assignPrefixFields.errorMessages(0).text)
        .to.be.equal(translation['hridHandling.validation.assignPrefixField']);
    });
  });

  describe('when input a value that exceeds the required length to fields', () => {
    describe('input more then 11 characters to the "Start with" field', () => {
      beforeEach(async () => {
        await HRIDHandlingInteractor.startWithFields.fields(0).fillAndBlur('111111111111');
      });

      it('renders an error message', () => {
        expect(HRIDHandlingInteractor.startWithFields.fields(0).inputError).to.be.true;
      });

      it('with correct wording', () => {
        expect(HRIDHandlingInteractor.startWithFields.errorMessages(0).text)
          .to.be.equal(`Invalid value. Maximum ${START_WITH_MAX_LENGTH} characters allowed`);
      });

      it('value length exceeds allowed length', () => {
        expect(HRIDHandlingInteractor.startWithFields.fields(0).val.length).to.be.above(START_WITH_MAX_LENGTH);
      });
    });

    describe('input more then 10 characters to the "Assign prefix" field', () => {
      beforeEach(async () => {
        await HRIDHandlingInteractor.assignPrefixFields.fields(0).fillAndBlur('111111111aa');
      });

      it('renders an error message', () => {
        expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).inputError).to.be.true;
      });

      it('with correct wording', () => {
        expect(HRIDHandlingInteractor.assignPrefixFields.errorMessages(0).text)
          .to.be.equal(`Invalid value. Maximum ${ASSIGN_PREFIX_MAX_LENGTH} characters allowed`);
      });

      it('value length exceeds allowed length', () => {
        expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).val.length).to.be.above(ASSIGN_PREFIX_MAX_LENGTH);
      });
    });
  });

  describe('when the required startWith field is empty', () => {
    beforeEach(async () => {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillAndBlur('');
    });

    it('renders an error message', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).inputError).to.be.true;
    });

    it('with correct wording', () => {
      expect(HRIDHandlingInteractor.startWithFields.errorMessages(0).text).to.be.equal(translation['hridHandling.validation.enterValue']);
    });
  });

  describe('when form is submitted', () => {
    describe('and settings are updated successfully', () => {
      setupApplication({ scenarios: ['fetch-hrid-settings-success', 'update-hrid-settings-success'] });

      beforeEach(async function () {
        await this.visit('/settings/inventory/hridHandling');

        await HRIDHandlingInteractor.startWithFields.fields(0).fillInput('765');
        await HRIDHandlingInteractor.startWithFields.fields(1).fillInput('001');
        await HRIDHandlingInteractor.startWithFields.fields(2).fillInput('5');
        await HRIDHandlingInteractor.submitFormButton.click();
      });

      describe('confirmation modal', () => {
        it('appears', () => {
          expect(HRIDHandlingInteractor.confirmationModal.isPresent).to.be.true;
        });

        describe('when clicking the confirm button', () => {
          beforeEach(async () => {
            await HRIDHandlingInteractor.confirmationModal.confirmButton.click();
          });

          it('then confirmation modal disappears', () => {
            expect(HRIDHandlingInteractor.confirmationModal.isPresent).to.be.false;
          });

          it('and successful toast appears', () => {
            expect(HRIDHandlingInteractor.callout.successCalloutIsPresent).to.be.true;
          });
        });

        describe('when clicking the cancel button', () => {
          beforeEach(async () => {
            await HRIDHandlingInteractor.confirmationModal.cancelButton.click();
          });

          it('then confirmation modal disappears', () => {
            expect(HRIDHandlingInteractor.confirmationModal.isPresent).to.be.false;
          });

          checkInitialValues();
        });
      });
    });

    describe('and the response contains error message', () => {
      setupApplication({ scenarios: ['fetch-hrid-settings-success', 'update-hrid-settings-error'] });

      beforeEach(async function () {
        await this.visit('/settings/inventory/hridHandling');

        await HRIDHandlingInteractor.startWithFields.fields(0).fillInput('765');
        await HRIDHandlingInteractor.startWithFields.fields(1).fillInput('001');
        await HRIDHandlingInteractor.startWithFields.fields(2).fillInput('5');
        await HRIDHandlingInteractor.submitFormButton.click();
        await HRIDHandlingInteractor.confirmationModal.confirmButton.click();
      });

      it('then error callout appears', () => {
        expect(HRIDHandlingInteractor.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });

  describe('Patron has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.hrid-handling': true,
      },
    });

    beforeEach(async function () {
      await this.visit('/settings/inventory/hridHandling');
    });

    it('should render HRID handling page', () => {
      expect(HRIDHandlingInteractor.isPresent).to.be.true;
    });
  });

  describe('Patron does not have permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
      },
    });

    beforeEach(async function () {
      await this.visit('/settings/inventory/hridHandling');
    });

    it('should not render HRID handling page', () => {
      expect(HRIDHandlingInteractor.isPresent).to.be.false;
    });
  });
});
