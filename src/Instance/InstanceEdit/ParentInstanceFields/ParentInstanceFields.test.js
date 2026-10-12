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
    it('should change instance', () => {
      fireEvent.click(screen.getByRole('button', { name: '+' }));

      expect(document.querySelectorAll('[data-test="instance-title-0"] .kvValue')[0].innerHTML).toEqual('new instance');
    });
  });

  describe('add parent instance', () => {
    it('should add parent instance', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add parent instance' }));

      expect(document.querySelectorAll('#clickable-add-parent-instance li').length).toEqual(2);
    });
  });
});
