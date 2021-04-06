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

import ChildInstanceFields from './ChildInstanceFields';

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const ChildInstanceFieldsSetup = () => (
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
        <Form onSubmit={noop} initialValues={{ childInstances: subInstances }}>
          <ChildInstanceFields relationshipTypes={relationshipTypes} />
        </Form>
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('ChildInstanceFields', () => {
  beforeEach(() => {
    renderWithIntl(
      <ChildInstanceFieldsSetup />,
      translationsProperties
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render child instances', () => {
    expect(document.querySelectorAll('#clickable-add-child-instance li').length).toEqual(1);
  });

  describe('change child instance', () => {
    beforeEach(async () => {
      await Button('+').click();
    });

    it('should change instance', () => {
      expect(document.querySelectorAll('[data-test="instance-title-0"] .kvValue')[0].innerHTML).toEqual('new instance');
    });
  });

  describe('add child instance', () => {
    beforeEach(async () => {
      await Button('Add child instance').click();
    });

    it('should add child instance', () => {
      expect(document.querySelectorAll('#clickable-add-child-instance li').length).toEqual(2);
    });
  });
});
