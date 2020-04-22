import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Button } from '@folio/stripes/components';

import setupApplication from '../helpers/setup-application';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceViewPage from '../interactors/instance-view-page';

describe('InstanceEditPage', () => {
  setupApplication({
    scenarios: ['default'],
    modules: [{
      type: 'plugin',
      name: '@folio/plugin-find-instance',
      displayName: 'Find instance',
      pluginType: 'find-instance',
      /* eslint-disable-next-line react/prop-types */
      module: ({ selectInstance }) => (
        <Button
          data-test-plugin-find-record-button
          onClick={() => selectInstance({ id: 1, title: 'Fake instance' })}
        >
          +
        </Button>
      ),
    }],
  });

  beforeEach(async function () {
    const instance = this.server.create('instance');
    this.visit(`/inventory/view/${instance.id}?layer=edit`);
  });

  it('displays the instance title in the pane header', () => {
    expect(InstanceEditPage.title).to.equal('Edit');
  });

  describe('pane header dropdown menu', () => {
    beforeEach(async () => {
      await InstanceEditPage.headerDropdown.click();
    });

    it('should not show the select-format select menu', () => {
      expect(InstanceEditPage.formats.isPresent).to.be.false;
    });

    it('should not show the classifications select menu', () => {
      expect(InstanceEditPage.languages.isPresent).to.be.false;
    });

    it('should not show the select-language select menu', () => {
      expect(InstanceEditPage.classifications.isPresent).to.be.false;
    });

    describe('clicking on add-classification', () => {
      beforeEach(async () => {
        await InstanceEditPage.clickAddClassification();
        await InstanceEditPage.clickAddClassification();
      });

      it('should show the classification identifier type menu', () => {
        expect(InstanceEditPage.classifications.isPresent).to.be.true;
      });

      it('the first option to be "Select classifation"', () => {
        expect(InstanceEditPage.classifications.firstOptionText).to.equal('Select classification type');
      });

      it('the first option to be disabled', () => {
        expect(InstanceEditPage.classifications.firstOptionIsDisabled).to.be.true;
      });
    });

    describe('clicking on add-format', () => {
      beforeEach(async () => {
        await InstanceEditPage.clickAddFormat();
        await InstanceEditPage.clickAddFormat();
      });

      it('should show the select-format select menu', () => {
        expect(InstanceEditPage.formats.isPresent).to.be.true;
      });

      it('first option should be "Select format"', () => {
        expect(InstanceEditPage.formats.firstOptionText).to.equal('Select format');
      });

      it('first option should be disabled', () => {
        expect(InstanceEditPage.formats.firstOptionIsDisabled).to.be.true;
      });

      describe('multi-item labels', () => {
        beforeEach(async () => {
          await InstanceEditPage.firstFormatFieldExists;
          await InstanceEditPage.secondFormatFieldExists;
        });

        it('should have a first label', () => {
          const id = InstanceEditPage.firstFormatLabelId;
          expect(InstanceEditPage.newI(id).text).to.equal('Format');
        });

        it('should not have a second label', () => {
          const id = InstanceEditPage.secondFormatLabelId;
          expect(InstanceEditPage.newI(id).isPresent).to.be.false;
        });
      });
    });

    describe('clicking on add-language', () => {
      beforeEach(async () => {
        await InstanceEditPage.clickAddLanguage();
        await InstanceEditPage.clickAddLanguage();
      });

      it('should show the select-language select menu', () => {
        expect(InstanceEditPage.languages.isPresent).to.be.true;
      });

      it('first option should be "Select language"', () => {
        expect(InstanceEditPage.languages.firstOptionText).to.equal('Select language');
      });

      it('first option should be disabled', () => {
        expect(InstanceEditPage.languages.firstOptionIsDisabled).to.be.true;
      });

      describe('multi-item labels', () => {
        beforeEach(async () => {
          await InstanceEditPage.firstLanguageFieldExists;
          await InstanceEditPage.secondLanguageFieldExists;
        });

        it('should have a first label', () => {
          const id = InstanceEditPage.firstLanguageLabelId;
          expect(InstanceEditPage.newI(id).text).to.equal('Language*');
        });

        it('should not have a second label', () => {
          const id = InstanceEditPage.secondLanguageLabelId;
          expect(InstanceEditPage.newI(id).isPresent).to.be.false;
        });
      });
    });

    describe('clicking on cancel', () => {
      beforeEach(async () => {
        await InstanceEditPage.headerDropdownMenu.clickCancel();
      });

      it('should redirect to instance view page', () => {
        expect(InstanceViewPage.$root).to.exist;
      });
    });
  });

  /**
   * Contributors
   */
  describe('clicking on "add contributor"', () => {
    const previousContributorCount = InstanceEditPage.contributors.contributorCount;

    beforeEach(async () => {
      await InstanceEditPage.contributors.clickAddNewContributor();
    });

    it('should increase number of contributors', () => {
      expect(InstanceEditPage.contributors.contributorCount).to.be.gt(previousContributorCount);
    });

    describe('clicking "make primary" on first contributor', () => {
      beforeEach(async () => {
        await InstanceEditPage.contributors.makeFirstContributorPrimary();
      });

      it('should change the button style to "primary"', () => {
        expect(InstanceEditPage.contributors.firstContributorIsPrimary).to.be.true;
      });
    });
  });

  describe('clicking on "add preceding title"', () => {
    const prevCount = InstanceEditPage.precedingTitles.precedingTitlesCount;

    beforeEach(async () => {
      await InstanceEditPage.precedingTitles.clickAddPrecedingTitle();
    });

    it('should increase number of preceding title"', () => {
      expect(InstanceEditPage.precedingTitles.precedingTitlesCount).to.be.gt(prevCount);
    });

    describe('saving unconnected titles', () => {
      beforeEach(async () => {
        await InstanceEditPage.precedingTitles.fillTitleField('title 1');
        await InstanceEditPage.precedingTitles.fillISBNField('isbn1');
        await InstanceEditPage.precedingTitles.fillISSNField('issn1');
        await InstanceEditPage.selectInstanceType('still image');
        await InstanceEditPage.saveInstance();
      });

      it('should save instance and go back to instance view', function () {
        expect(this.location.search).to.not.include('layer=edit');
      });
    });

    describe('clicking add instance', () => {
      beforeEach(async () => {
        await InstanceEditPage.precedingTitles.clickAddInstance();
      });

      it('should add instance', () => {
        expect(InstanceEditPage.precedingTitles.instanceName).to.be.equal('Fake instance');
      });
    });
  });

  describe('clicking on "add succeeding title"', () => {
    const prevCount = InstanceEditPage.succeedingTitles.succeedingTitlesCount;

    beforeEach(async () => {
      await InstanceEditPage.succeedingTitles.clickAddSucceedingTitle();
    });

    it('should increase number of succeeding title"', () => {
      expect(InstanceEditPage.succeedingTitles.succeedingTitlesCount).to.be.gt(prevCount);
    });

    describe('saving without title', () => {
      beforeEach(async () => {
        await InstanceEditPage.selectInstanceType('still image');
        await InstanceEditPage.saveInstance();
      });

      it('should not save instance without missing title', function () {
        expect(this.location.search).to.include('layer=edit');
      });
    });

    describe('saving unconnected titles', () => {
      beforeEach(async () => {
        await InstanceEditPage.succeedingTitles.fillTitleField('title 1');
        await InstanceEditPage.succeedingTitles.fillISBNField('isbn1');
        await InstanceEditPage.succeedingTitles.fillISSNField('issn1');
        await InstanceEditPage.selectInstanceType('still image');
        await InstanceEditPage.saveInstance();
      });

      it('should save instance and go back to instance view', function () {
        expect(this.location.search).to.not.include('layer=edit');
      });
    });

    describe('clicking add instance', () => {
      beforeEach(async () => {
        await InstanceEditPage.succeedingTitles.clickAddInstance();
      });

      it('should add instance', () => {
        expect(InstanceEditPage.succeedingTitles.instanceName).to.be.equal('Fake instance');
      });
    });
  });
});
