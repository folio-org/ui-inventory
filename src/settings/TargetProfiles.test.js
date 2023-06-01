import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '../../test/jest/__mock__/currencyData.mock';
import '../../test/jest/__mock__/stripesConfig.mock';
import '../../test/jest/__mock__/stripesCore.mock';
import '../../test/jest/__mock__/stripesIcon.mock';
import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';
import TargetProfiles from './TargetProfiles';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EntryManager: (data) => {
    const component =
      <div>
        EntryManager
        <div>{data.label}</div>
        <div>
          {data.entryList.map((x) => <div key={x.id}>{x.displayName}</div>)}
        </div>
      </div>;
    return component;
  },
}), { virtual: true });

const history = createMemoryHistory();
const resources = {
  entries: {
    resource: 'profiles',
    records: [
      {
        id: '1',
        name: 'Profile 1',
        enabled: true,
      },
      {
        id: '2',
        name: 'Profile 2',
        enabled: true,
      }
    ]
  }
};

const mutator = {
  entries: {
    GET: jest.fn(),
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

const renderTragetProfiles = (props) => renderWithIntl(
  <Router history={history}>
    <TargetProfiles {...props} />
  </Router>,
  translationsProperties
);

describe('TargetProfiles', () => {
  it('Component should render properly', () => {
    renderTragetProfiles(defaultProps);
    expect(screen.getByText('EntryManager')).toBeInTheDocument();
    expect(screen.getByText('✓ Profile 1')).toBeInTheDocument();
    expect(screen.getByText('✓ Profile 2')).toBeInTheDocument();
    expect(screen.getByText('test label')).toBeInTheDocument();
  });
});
