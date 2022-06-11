import React from 'react';
import { Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { screen, fireEvent } from '@testing-library/react';

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
  },
  recordsBrowseCallNumber : {
    hasLoaded: true,
    resource: 'records',
    records: callNumbers,
    other: {
      totalRecords: callNumbers.length
    },
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

const defaultTestSegment = 'instances';

const renderInstancesList = (props = {}) => {
  const {
    indexes,
    indexesES,
    renderer,
  } = getFilterConfig(props.segment || defaultTestSegment);

  return renderWithIntl(
    <Router history={history}>
      <StripesContext.Provider value={stripesStub}>
        <ModuleHierarchyProvider module="@folio/inventory">
          <InstancesList
            parentResources={resources}
            parentMutator={{
              resultCount: { replace: noop },
              query: { update: updateMock },
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
            segment={defaultTestSegment}
            searchableIndexes={indexes}
            searchableIndexesES={indexesES}
            fetchFacets={noop}
            {...props}
          />
        </ModuleHierarchyProvider>
      </StripesContext.Provider>
    </Router>,
    translationsProperties
  );
};

describe('InstancesList', () => {
  describe('rendering InstancesList with instances segment', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have proper list results size', () => {
      renderInstancesList();

      expect(document.querySelectorAll('#pane-results-content .mclRowContainer > [role=row]').length).toEqual(3);
    });

    it('should have selected browse call number option', () => {
      renderInstancesList();

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'callNumbers' }
      });

      expect((screen.getByRole('option', { name: 'Browse call numbers' })).selected).toBeTruthy();
    });

    it('should have selected subject browse option', () => {
      renderInstancesList();

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'browseSubjects' }
      });

      expect((screen.getByRole('option', { name: 'Browse subjects' })).selected).toBeTruthy();
    });

    it('should have selected contributors browse option', () => {
      renderInstancesList();

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'contributors' }
      });

      expect((screen.getByRole('option', { name: 'Browse contributors' })).selected).toBeTruthy();
    });

    describe('opening action menu', () => {
      it('should disable toggable columns', () => {
        renderInstancesList();

        userEvent.click(screen.getByRole('button', { name: 'Actions' }));

        expect(screen.getByText(/show columns/i)).toBeInTheDocument();
      });

      describe('hiding contributors column', () => {
        it('should hide contributors column', () => {
          renderInstancesList();

          userEvent.click(screen.getByRole('button', { name: 'Actions' }));
          userEvent.click(screen.getByTestId('contributors'));

          expect(document.querySelector('#clickable-list-column-contributors')).not.toBeInTheDocument();
        });
      });
    });

    describe('changing search index', () => {
      describe('selecting a browse option', () => {
        it('should handle query update with browse segment', () => {
          renderInstancesList();

          fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'contributors' },
          });

          expect(updateMock).toHaveBeenCalledWith({
            qindex: 'contributors',
            segment: 'browse',
          });
        });
      });
    });
  });

  describe('rendering InstancesList with browse segment', () => {
    it('should display Instances segment navigation button as primary', () => {
      renderInstancesList({ segment: 'browse' });

      expect(screen.getByRole('button', { name: 'Instance' })).toHaveClass('primary');
    });

    describe('selecting an instance option after a browse option', () => {
      it('should handle query update with instances segment', () => {
        renderInstancesList({ segment: 'browse' });

        fireEvent.change(screen.getByRole('combobox'), {
          target: { value: 'hrid' },
        });

        expect(updateMock).toHaveBeenCalledWith({
          qindex: 'hrid',
          segment: 'instances',
        });
      });
    });
  });

  describe('rendering InstancesList with holdings segment', () => {
    it('should show Save Holdings UUIDs button', () => {
      renderInstancesList({ segment: 'holdings' });

      userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(screen.getByRole('button', { name: 'Save holdings UUIDs' })).toBeVisible();
    });
  });
});
