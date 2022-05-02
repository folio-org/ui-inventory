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
  relatedInstances,
  relatedInstanceTypes,
} from '../../../../test/fixtures';

import RelatedInstanceFields from './RelatedInstanceFields';

export const relatedInstanceOptions = relatedInstanceTypes.map(it => ({
  label: it.name,
  value: it.id,
}));

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const RelatedInstanceFieldsSetup = () => (
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
        <Form onSubmit={noop} initialValues={{ relatedInstances }}>
          <RelatedInstanceFields relationshipTypes={relatedInstanceOptions} />
        </Form>
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('RelatedInstanceFields', () => {
  beforeEach(() => {
    renderWithIntl(
      <RelatedInstanceFieldsSetup />,
      translationsProperties
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render related instances', () => {
    expect(document.querySelectorAll('#clickable-add-related-instance li').length).toEqual(1);
  });

  describe('change related instance', () => {
    beforeEach(async () => {
      await Button('+').click();
    });

    it('should change instance', () => {
      expect(document.querySelectorAll('[data-test="related-instance-title-0"] .kvValue')[0].innerHTML).toEqual('new instance');
    });
  });

  describe('add related instance', () => {
    beforeEach(async () => {
      await Button('Add related instance').click();
    });

    it('should add related instance', () => {
      expect(document.querySelectorAll('#clickable-add-related-instance li').length).toEqual(2);
    });
  });
});
