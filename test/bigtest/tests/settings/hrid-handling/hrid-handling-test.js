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

describe('Setting of HRID Handling', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/inventory/hridHandling');
  });

  it('renders', () => {
    expect(HRIDHandlingInteractor.isPresent).to.be.true;
  });

  it('has 3 startWith fields', () => {
    expect(HRIDHandlingInteractor.startWithFields.fields().length).to.be.equal(3);
  });

  it('has 3 assignPrefix fields', () => {
    expect(HRIDHandlingInteractor.assignPrefixFields.fields().length).to.be.equal(3);
  });

  describe('when is pristine', () => {
    it('the submit button is disabled', () => {
      expect(HRIDHandlingInteractor.submitFormButtonDisabled).to.be.true;
    });

    it('has initialValues for startWith fields', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).val).to.be.equal('00000000001');
      expect(HRIDHandlingInteractor.startWithFields.fields(1).val).to.be.equal('00000000001');
      expect(HRIDHandlingInteractor.startWithFields.fields(2).val).to.be.equal('00000000001');
    });

    it('has initialValues for assignPrefix fields', () => {
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(0).val).to.be.equal('in');
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(1).val).to.be.equal('ho');
      expect(HRIDHandlingInteractor.assignPrefixFields.fields(2).val).to.be.equal('it');
    });
  });

  describe('when is changed correctly', () => {
    beforeEach(async function () {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillInput('0001');
      await HRIDHandlingInteractor.assignPrefixFields.fields(0).fillInput('it');
    });

    it('the submit button is not disabled', () => {
      expect(HRIDHandlingInteractor.submitFormButtonDisabled).to.be.false;
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

  describe('when input a non numeric value to the startWith field', () => {
    beforeEach(async function () {
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
    beforeEach(async function () {
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
      beforeEach(async function () {
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
      beforeEach(async function () {
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
    beforeEach(async function () {
      await HRIDHandlingInteractor.startWithFields.fields(0).fillAndBlur('');
    });

    it('renders an error message', () => {
      expect(HRIDHandlingInteractor.startWithFields.fields(0).inputError).to.be.true;
    });

    it('with correct wording', () => {
      expect(HRIDHandlingInteractor.startWithFields.errorMessages(0).text).to.be.equal(translation['hridHandling.validation.enterValue']);
    });
  });
});
