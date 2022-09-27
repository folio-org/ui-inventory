import React from 'react';
import { Router } from 'react-router-dom';
import { noop, cloneDeep } from 'lodash';
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
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

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

        describe('when Instance record is linked to an authority record', () => {
          describe('by clicking on the icon of an authority app', () => {
            const record = {
              contributorNameTypeId: '2b94c631-fca9-4892-a730-03ee529ffe2a',
              isAnchor: false,
              name: 'McOrmond, Steven Craig (Test) 1971-',
              totalRecords: 1,
            };
            const authorityId = 'bb30e977-f934-4a2f-8fb8-858bac51b7ab';
            const linkedRecord = {
              ...record,
              authorityId,
            };
            const records = [linkedRecord];
            const props = {
              segment: 'instances',
              parentResources: {
                ...resources,
                records: {
                  ...resources.records,
                  records,
                },
                browseModeRecords: {
                  records,
                },
              },
            };

            beforeEach(() => {
              cleanup();

              const { rerender, getByRole, getByTestId } = renderInstancesList(props);
              const newProps = cloneDeep(props);
              newProps.parentResources.query.qindex = 'contributors';

              fireEvent.change(getByRole('combobox'), { target: { value: 'contributors' } });
              renderInstancesList(newProps, rerender);
              fireEvent.click(getByTestId('authority-app-link'));
            });

            it('should open the authority record in a new tab', () => {
              expect(mockWindowOpen).toHaveBeenCalledWith(
                `marc-authorities/authorities/${authorityId}?segment=search`,
                '_blank',
                'noopener,noreferrer'
              );
            });

            it('should not handle row click', () => {
              expect(updateMock).toHaveBeenCalledTimes(1); // 1 - changing search index
            });
          });
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
