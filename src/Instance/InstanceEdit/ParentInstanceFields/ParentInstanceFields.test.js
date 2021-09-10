import React from 'react';
import { noop, keyBy } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import stripesFinalForm from '@folio/stripes/final-form';

import { DataContext } from '../../../contexts';
import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../../test/jest/helpers';
import {
  identifierTypes,
  instanceRelationshipTypes,
  subInstances,
  relationshipTypes,
} from '../../../../test/fixtures';

import ParentInstanceFields from './ParentInstanceFields';

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const ParentInstanceFieldsSetup = () => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <DataContext.Provider value={{
        contributorTypes: [],
        identifierTypes,
        identifierTypesById: keyBy(identifierTypes, 'id'),
        identifierTypesByName: keyBy(identifierTypes, 'name'),
        instanceRelationshipTypes,
        instanceRelationshipTypesById: keyBy(identifierTypes, 'id'),
        instanceFormats: [],
        modesOfIssuance: [],
        natureOfContentTerms: [],
        tagsRecords: [],
      }}
      >
        <Form onSubmit={noop} initialValues={{ parentInstances: subInstances }}>
          <ParentInstanceFields relationshipTypes={relationshipTypes} />
        </Form>
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('ParentInstanceFields', () => {
  beforeEach(() => {
    renderWithIntl(
      <ParentInstanceFieldsSetup />,
      translationsProperties
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render parent instances', () => {
    expect(document.querySelectorAll('#clickable-add-parent-instance li').length).toEqual(1);
  });

  describe('change parent instance', () => {
    beforeEach(async () => {
      await Button('+').click();
    });

    it('should change instance', () => {
      expect(document.querySelectorAll('[data-test="instance-title-0"] .kvValue')[0].innerHTML).toEqual('new instance');
    });
  });

  describe('add parent instance', () => {
    beforeEach(async () => {
      await Button('ui-inventory.addParentInstance').click();
    });

    it('should add parent instance', () => {
      expect(document.querySelectorAll('#clickable-add-parent-instance li').length).toEqual(2);
    });
  });
});
