import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';

import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';

const segment = 'instances';
const {
  indexes,
  renderer,
} = getFilterConfig(segment);

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};
const data = {
  contributorTypes: [],
  instanceTypes: [],
  locations: [],
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  tagsRecords: [],
};
const query = {
  query: '',
  sort: 'title',
};

const InstancesListSetup = ({
  instances = instancesFixture,
} = {}) => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <InstancesList
        parentResources={{
          query,
          records: {
            hasLoaded: true,
            resource: 'records',
            records: instances,
            other: { totalRecords: instances.length },
          },
          resultCount: instances.length,
          resultOffset: 0,
        }}
        parentMutator={{ resultCount: { replace: noop } }}
        data={{
          ...data,
          query
        }}
        onSelectRow={noop}
        renderFilters={renderer({ ...data, query })}
        segment={segment}
        searchableIndexes={indexes}
      />
    </StripesContext.Provider>
  </Router>
);

describe('InstancesRoute', () => {
  describe('rendering InstancesList', () => {
    beforeEach(() => {
      renderWithIntl(
        <InstancesListSetup />,
        translationsProperties
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have proper list results size', () => {
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
    });

    describe('opening action menu', () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      });

      it('should disable toggable columns', () => {
        expect(screen.getByText(/show columns/i)).toBeInTheDocument();
      });

      describe('hiding contributors column', () => {
        beforeEach(() => {
          userEvent.click(screen.getByTestId('contributors'));
        });

        it('should hide contributors column', () => {
          expect(document.querySelector('#clickable-list-column-contributors')).not.toBeInTheDocument();
        });
      });
    });
  });
});
