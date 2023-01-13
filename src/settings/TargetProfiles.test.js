import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import TargetProfiles from './TargetProfiles';

jest.unmock('@folio/stripes/components');

const resources = {
  entries: {
    type: 'okapi',
    records: [{
      displayName: '✓test',
      enabled:true,
      name:'profiles'
    }, {
      displayName: '✕test',
      enabled:true,
      name:'profiles'
    }],
    path: 'copycat/profiles',
    resourceShouldRefresh: true,
    GET: {
      path: 'copycat/profiles?query=cql.allRecords=1&limit=1000',
    },
  }
};

const mutator = {
  entries: {
    PUT: jest.fn(),
    POST: jest.fn(),
    DELETE: jest.fn(),
  }
};

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
  label:'test label',
  resources,
  mutator,
};
const TargetProfilesSetup = () => (
  <MemoryRouter>
    <TargetProfiles {...defaultProps} />
  </MemoryRouter>
);
const renderTargetProfilesSettings = () => renderWithIntl(
  <TargetProfilesSetup />,
  translationsProperties
);
describe('TargetProfiles Component', () => {
  it('should render component', () => {
    const { container } = renderTargetProfilesSettings();
    expect(container).toBeDefined();
  });
});
