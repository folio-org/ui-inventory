import React from 'react';
import { noop, keyBy } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../test/jest/__mock__';

import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { StripesContext } from '@folio/stripes/core';
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
    it('should change instance', () => {
      fireEvent.click(screen.getByRole('button', { name: '+' }));

      expect(document.querySelectorAll('[data-test="instance-title-0"] .kvValue')[0].innerHTML).toEqual('new instance');
    });
  });

  describe('add child instance', () => {
    it('should add child instance', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add child instance' }));

      expect(document.querySelectorAll('#clickable-add-child-instance li').length).toEqual(2);
    });
  });
});
