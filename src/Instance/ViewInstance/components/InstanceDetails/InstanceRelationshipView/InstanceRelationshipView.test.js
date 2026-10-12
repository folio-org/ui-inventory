import React from 'react';
import { keyBy } from 'lodash';
import sinon from 'sinon';
import * as reactQuery from 'react-query';

import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';

import { DataContext } from '../../../../../contexts';
import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../../../../test/jest/helpers';
import {
  identifierTypes,
  instancesExpanded,
  instanceRelationshipTypes,
  childInstances,
} from '../../../../../../test/fixtures';

import InstanceRelationshipView from './InstanceRelationshipView';

const sandbox = sinon.createSandbox();

const InstanceRelationshipViewSetup = () => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <DataContext.Provider value={{
        contributorTypes: [],
        identifierTypes,
        instanceRelationshipTypes,
        identifierTypesById: keyBy(identifierTypes, 'id'),
        identifierTypesByName: keyBy(identifierTypes, 'name'),
        instanceRelationshipTypesById: keyBy(instanceRelationshipTypes, 'name'),
        instanceFormats: [],
        modesOfIssuance: [],
        natureOfContentTerms: [],
        tagsRecords: [],
      }}
      >
        <InstanceRelationshipView
          id="accordion-id"
          childInstances={childInstances}
          parentInstances={[]}
        />
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('InstanceRelationshipView', () => {
  beforeEach(() => {
    sandbox.stub(reactQuery, 'useQueries').returns(
      instancesExpanded.map(instance => ({ data: { instances: [instance] }, isSuccess: true }))
    );

    renderWithIntl(
      <InstanceRelationshipViewSetup />,
      translationsProperties
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    sandbox.restore();
  });

  it('should render child instances', () => {
    expect(document.querySelectorAll('.mclRowFormatterContainer').length).toEqual(4);
  });
});
