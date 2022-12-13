import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
  act,
  fireEvent,
  screen,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';

const updateMock = jest.fn();

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
  contributorNameTypes: [],
  instanceTypes: [],
  locations: [],
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  tagsRecords: [],
  facets: [],
};
const query = {
  query: '',
  sort: 'title',
};

const resources = {
  query,
  records: {
    hasLoaded: true,
    resource: 'records',
    records: instancesFixture,
    other: { totalRecords: instancesFixture.length },
    isPending: false,
  },
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [],
    other: { totalRecords: 0 }
  },
  resultCount: instancesFixture.length,
  resultOffset: 0,
};

let history;

const renderInstancesList = ({
  segment,
  ...rest
}, rerender) => {
  const {
    indexes,
    indexesES,
    renderer,
  } = getFilterConfig(segment);

  return renderWithIntl(
    <Router history={history}>
      <StripesContext.Provider value={stripesStub}>
        <ModuleHierarchyProvider module="@folio/inventory">
          <InstancesList
            parentResources={resources}
            parentMutator={{
              resultCount: { replace: noop },
              query: { update: updateMock, replace: noop },
            }}
            data={{
              ...data,
              query
            }}
            onSelectRow={noop}
            renderFilters={renderer({
              ...data,
              query,
              parentResources: resources,
            })}
            segment={segment}
            searchableIndexes={indexes}
            searchableIndexesES={indexesES}
            fetchFacets={noop}
            {...rest}
          />
        </ModuleHierarchyProvider>
      </StripesContext.Provider>
    </Router>,
    translationsProperties,
    rerender,
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    beforeEach(() => {
      history = createMemoryHistory();
      renderInstancesList({ segment: 'instances' });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have proper list results size', () => {
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
    });

    describe('opening action menu', () => {
      beforeEach(() => {
        fireEvent.change(screen.getByRole('combobox'), {
          target: { value: 'all' }
        });

        userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      });

      it('should disable toggleable columns', () => {
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

    describe('filters pane', () => {
      it('should have selected effective call number option', async () => {
        await act(async () => userEvent.selectOptions(screen.getByLabelText('Search field index'), 'callNumber'));

        expect((screen.getByRole('option', { name: 'Effective call number (item), shelving order' })).selected).toBeTruthy();
      });

      it('should have query in search input', () => {
        userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'search query');
        userEvent.click(screen.getAllByRole('button', { name: 'Search' })[1]);

        expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('search query');
      });
    });
  });

  describe('rendering InstancesList with holdings segment', () => {
    it('should show Save Holdings UUIDs button', () => {
      renderInstancesList({ segment: 'holdings' });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'all' }
      });

      userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByRole('button', { name: 'Save holdings UUIDs' })).toBeVisible();
    });
  });
});
