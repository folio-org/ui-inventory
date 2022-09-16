import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../test/fixtures/instances';
import { items as callNumbers } from '../../../test/fixtures/callNumbers';
import { getFilterConfig } from '../../filterConfig';
import InstancesList from './InstancesList';

const updateMock = jest.fn();
const resetBrowseModeRecordsMock = jest.fn();

const paramsMock = {
  query: 'fakeQuery',
  browsePoint: 'fakeBrowsePoint',
  selectedBrowseResult: 'fakeSelectedBrowseResult',
  qindex: 'fakeQindex',
  filters: 'fakeFilters',
  sort: 'fakeSort',
};

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
  recordsBrowseCallNumber : {
    hasLoaded: true,
    resource: 'records',
    records: callNumbers,
    other: {
      totalRecords: callNumbers.length
    },
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

const history = createMemoryHistory();

const renderInstancesList = ({
  segment,
  ...rest
}) => {
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
            {...rest}
            parentResources={resources}
            parentMutator={{
              resultCount: { replace: noop },
              query: { update: updateMock, replace: noop },
              browseModeRecords: {
                reset: resetBrowseModeRecordsMock,
              },
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
          />
        </ModuleHierarchyProvider>
      </StripesContext.Provider>
    </Router>,
    translationsProperties
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    beforeEach(() => {
      renderInstancesList({ segment: 'instances' });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have proper list results size', () => {
      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
    });

    it('should have selected browse call number option', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Search field index'), 'callNumbers');
      waitFor(() => {
        expect((screen.getByRole('option', { name: 'Browse call numbers' })).selected).toBeTruthy();
      });
    });

    it('should have selected subject browse option', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Search field index'), 'browseSubjects');
      waitFor(() => {
        expect((screen.getByRole('option', { name: 'Browse subjects' })).selected).toBeTruthy();
      });
    });

    it('should have selected contributors browse option', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Search field index'), 'contributors');
      waitFor(() => {
        expect((screen.getByRole('option', { name: 'Browse contributors' })).selected).toBeTruthy();
      });
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

    describe('changing search index', () => {
      describe('selecting a browse option', () => {
        it('should handle query update with browse segment', () => {
          fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'contributors' },
          });

          expect(updateMock).toHaveBeenCalledWith({
            qindex: 'contributors',
            filters: '',
            selectedBrowseResult: false,
            browsePoint: '',
          });
        });

        it('should reset browse records', () => {
          fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contributors' } });
          expect(resetBrowseModeRecordsMock).toHaveBeenCalled();
        });

        it('should display Instances segment navigation button as primary', () => {
          fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'contributors' },
          });

          expect(screen.getByRole('button', { name: 'Instance' })).toHaveClass('primary');
        });

        it('should pass correct params to URL', () => {
          cleanup();
          renderInstancesList({
            segment: 'instances',
            getParams: () => paramsMock,
          });
          fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'contributors' },
          });

          expect(history.location.search).toBe('?qindex=contributors&query=fakeQuery&sort=fakeSort');
        });
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
