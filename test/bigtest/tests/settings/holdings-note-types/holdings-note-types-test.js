import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsNoteTypes from '../../../interactors/settings/holdings-note-types/holdings-note-types';

describe('Holdings note types', () => {
  setupApplication();

  beforeEach(function () {
    this.server.create('holdingsNoteType', {
      'id' : 'd6510242-5ec3-42ed-b593-3585d2e48fd6',
      'name' : 'Action note',
      'source' : 'folio'
    });
    this.server.create('holdingsNoteType', {
      'id' : 'e19eabab-a85c-4aef-a7b2-33bd9acef24e',
      'name' : 'Binding',
      'source' : 'folio'
    });
    this.server.create('holdingsNoteType', {
      'id' : 'c4407cc7-d79f-4609-95bd-1cefb2e2b5c5',
      'name' : 'Copy note',
      'source' : 'folio'
    });
  });

  describe('viewing holdings note types list', () => {
    beforeEach(function () {
      this.visit('/settings/inventory/holdingsNoteTypes');
    });

    it('has a holdings note types list', () => {
      expect(HoldingsNoteTypes.hasList).to.be.true;
    });

    it('list has 3 items', () => {
      expect(HoldingsNoteTypes.rowCount).to.equal(3);
    });
  });
});
