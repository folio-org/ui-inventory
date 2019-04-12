import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceCreatePage from '../interactors/instance-create-page';

describe.only('InstanceViewPage', () => {
  setupApplication();

  beforeEach(async function () {
    const instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH',
    });

    this.server.get('/locations', {
      locations: [
        {
          id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
          name: 'Annex',
          code: 'KU/CC/DI/A',
          isActive: true,
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          servicePointIds: [
            '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          ],
        },
        {
          id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
          name: 'Main Library',
          code: 'KU/CC/DI/M',
          isActive: true,
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          servicePointIds: [
            '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          ],
        },
        {
          id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
          name: 'ORWIG ETHNO CD',
          code: 'KU/CC/DI/O',
          isActive: true,
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          servicePointIds: [
            '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          ],
        },
        {
          id: 'b241764c-1466-4e1d-a028-1a3684a5da87',
          name: 'Popular Reading Collection',
          code: 'KU/CC/DI/P',
          isActive: true,
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          servicePointIds: [
            '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          ],
        },
        {
          id: 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
          name: 'SECOND FLOOR',
          code: 'KU/CC/DI/2',
          isActive: true,
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          servicePointIds: [
            '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          ],
        },
      ],
      totalRecords : 5,
    });
    this.server.get('/locations/:id');

    this.server.get('/inventory/items', {
      items: [
        {
          id: '7abd8dfe-0234-4256-b2e6-539499999cac',
          status: {
            name: 'Checked out',
          },
          title: '14 cows for America',
          hrid: 'it00000168',
          contributorNames: [
            {
              name: 'Deedy, Carmen Agra.',
            },
            {
              name: 'Naiyomah, Wilson Kimeli.',
            },
            {
              name: 'Gonzalez, Thomas',
            },
          ],
          formerIds: [],
          discoverySuppress: null,
          holdingsRecordId: '44a21d17-a666-4f34-b24d-644f8ed1537b',
          barcode: '5860825104574',
          copyNumbers: [],
          notes: [],
          circulationNotes: [],
          numberOfPieces: '3',
          yearCaption: [],
          electronicAccess: [],
          statisticalCodeIds: [],
          purchaseOrderLineIdentifier: null,
          materialType: {
            id: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
            name: 'book',
          },
          permanentLoanType: {
            id: '2b94c631-fca9-4892-a730-03ee529ffe27',
            name: 'Can circulate',
          },
          metadata: {
            createdDate: '2019-04-11T03:34:21.745+0000',
            createdByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
            updatedDate: '2019-04-11T12:01:48.451+0000',
            updatedByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
          },
          links: {
            self: 'http://folio-snapshot-646.aws.indexdata.com:9130/inventory/items/7abd8dfe-0234-4256-b2e6-539499999cac',
          },
          effectiveLocation: {
            id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
            name: 'Main Library',
          },
        },
      ],
      totalRecords: 1,
    });

    this.server.get('/holdings-storage/holdings', {
      holdingsRecords: [
        {
          id: '44a21d17-a666-4f34-b24d-644f8ed1537b',
          hrid: 'ho00000111',
          formerIds: [],
          instanceId: '7a8f9775-8de3-4308-8323-b055c104e0f3',
          permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
          electronicAccess: [],
          notes: [],
          holdingsStatements: [],
          holdingsStatementsForIndexes: [],
          holdingsStatementsForSupplements: [],
          statisticalCodeIds: [],
          holdingsItems: [],
          metadata: {
            createdDate: '2019-04-11T03:34:20.887+0000',
            createdByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
            updatedDate: '2019-04-11T03:34:20.887+0000',
            updatedByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
          },
        },
      ],
      totalRecords: 1,
    });

    this.visit(`/inventory/view/${instance.id}`);
  });

  it('displays the instance title in the pane header', () => {
    expect(InstanceViewPage.title).to.equal('ADVANCING RESEARCH');
  });

  // describe('pane header dropdown menu', () => {
  //   beforeEach(async () => {
  //     await InstanceViewPage.headerDropdown.click();
  //   });

  //   describe('clicking on edit', () => {
  //     beforeEach(async () => {
  //       await InstanceViewPage.headerDropdownMenu.clickEdit();
  //     });

  //     it('should redirect to instance edit page', () => {
  //       expect(InstanceEditPage.$root).to.exist;
  //     });
  //   });

  //   describe('clicking on duplicate', () => {
  //     beforeEach(async () => {
  //       await InstanceViewPage.headerDropdownMenu.clickDuplicate();
  //     });

  //     it('should redirect to instance create page', () => {
  //       expect(InstanceCreatePage.$root).to.exist;
  //     });
  //   });
  // });
});
