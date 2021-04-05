import React from 'react';
import { keyBy } from 'lodash';
import sinon from 'sinon';
import * as reactQuery from 'react-query';

import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import { DataContext } from '../../../contexts';
import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../../test/jest/helpers';
import {
  identifierTypes,
  instances,
} from '../../../../test/fixtures';

import InstanceRelationshipView from './InstanceRelationshipView';

const sandbox = sinon.createSandbox();

const InstanceRelationshipViewSetup = () => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <DataContext.Provider value={{
        contributorTypes: [],
        identifierTypes,
        identifierTypesById: keyBy(identifierTypes, 'id'),
        identifierTypesByName: keyBy(identifierTypes, 'name'),
        instanceFormats: [],
        modesOfIssuance: [],
        natureOfContentTerms: [],
        tagsRecords: [],
      }}
      >
        <InstanceRelationshipView
          id="accordion-id"
          instance={instances[0]}
        />
      </DataContext.Provider>
    </StripesContext.Provider>
  </Router>
);

describe('InstanceRelationshipView', () => {
  beforeEach(() => {
    sandbox.stub(reactQuery, 'useQueries').returns(
      instances.map(instance => ({ data: instance, isLoading: false, isSuccess: true }))
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
    expect(document.querySelectorAll('[role="row"]').length).toEqual(8);
  });
});
