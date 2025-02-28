import '../../../test/jest/__mock__';

import flow from 'lodash/flow';
import queryString from 'query-string';
import { act, cleanup, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import {
  FACETS,
  browseModeOptions,
  browseCallNumberOptions,
} from '@folio/stripes-inventory-components';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import {
  BROWSE_INVENTORY_ROUTE,
  INVENTORY_ROUTE,
} from '../../constants';
import { DataContext } from '../../contexts';
import BrowseResultsList from './BrowseResultsList';
import { getSearchParams } from './utils';

const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;
let history = createMemoryHistory({
  initialEntries: [{
    pathname: BROWSE_INVENTORY_ROUTE,
    search: 'qindex=callNumbers&query=A',
  }],
});

const defaultProps = {
  browseData: [
    {
      fullCallNumber: 'Aaa',
      callNumber: 'Aaa',
      isAnchor: true,
      totalRecords: 0,
    },
    {
      fullCallNumber: 'A 1958 A 8050',
      callNumber: 'A 1958 A 8050',
      totalRecords: 1,
    },
    {
      fullCallNumber: 'ABBA',
      callNumber: 'ABBA',
      totalRecords: 2,
    },
  ],
  isEmptyMessage: 'Empty Message',
  isLoading: false,
  pagination: {
    hasNextPage: false,
    hasPrevPage: false,
    onNeedMoreData: jest.fn(),
    pageConfig: [0, null, null],
  },
  totalRecords: 1,
  filters: {},
};

const mockContext = {
  contributorNameTypes: [{
    id: '2b94c631-fca9-4892-a730-03ee529ffe2a',
  }],
  contributorTypes: [{
    id: '6e09d47d-95e2-4d8a-831b-f777b8ef6d81',
    name: 'Author',
  }],
  classificationBrowseConfig: [
    {
      id: 'all',
      typeIds: [],
    },
    {
      id: 'dewey',
      typeIds: [
        'id-dewey',
      ]
    },
    {
      id: 'lc',
      typeIds: [
        'id-lc',
        'id-lc-local',
      ],
    },
  ],
  callNumberBrowseConfig: [
    {
      id: 'dewey',
      typeIds: ['dewey-id', 'lc-id'],
    },
  ],
  subjectSources: [{ id: 'sourceId', name: 'sourceName' }],
  subjectTypes: [{ id: 'typeId', name: 'typeName' }],
};

const contributorsData = [
  {
    'name': 'Toth, Josh',
    'contributorTypeId': [
      '6e09d47d-95e2-4d8a-831b-f777b8ef6d81'
    ],
    'contributorNameTypeId': '2b94c631-fca9-4892-a730-03ee529ffe2a',
    'isAnchor': false,
    'totalRecords': 1
  },
];
const subjectsData = [
  {
    'value': 'Trivia and miscellanea',
    'sourceId': 'sourceId',
    'typeId': 'typeId',
    'totalRecords': 8
  },
];

const renderBrowseResultsList = (props = {}) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={mockContext}>
      <BrowseResultsList
        {...defaultProps}
        {...props}
      />
    </DataContext.Provider>
  </Router>,
  translationsProperties,
);

describe('BrowseResultsList', () => {
  it('should render browse data', () => {
    renderBrowseResultsList();

    expect(screen.getByText(defaultProps.browseData[1].callNumber)).toBeInTheDocument();
  });

  it('should navigate to instance Search page and show related instances', async () => {
    renderBrowseResultsList();

    await act(async () => fireEvent.click(screen.getByText(defaultProps.browseData[2].callNumber)));

    const { pathname, search } = history.location;

    expect(pathname).toEqual(INVENTORY_ROUTE);
    expect(search).toEqual(
      flow(
        getSearchParams,
        queryString.stringify,
        expect.stringContaining
      )(defaultProps.browseData[2], browseModeOptions.CALL_NUMBERS)
    );
  });

  describe.each([
    { searchOption: browseCallNumberOptions.CALL_NUMBERS, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.DEWEY, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.LIBRARY_OF_CONGRESS, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.LOCAL, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.NATIONAL_LIBRARY_OF_MEDICINE, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.OTHER, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
    { searchOption: browseCallNumberOptions.SUPERINTENDENT, shared: FACETS.CALL_NUMBERS_SHARED, heldBy: FACETS.CALL_NUMBERS_HELD_BY },
  ])('when the search option is $searchOption and the Shared and/or HeldBy facets are selected', ({ searchOption, shared, heldBy }) => {
    describe('and the user clicks on a record in the list', () => {
      it('should be navigated to the Search lookup with those filters', async () => {
        history = createMemoryHistory({
          initialEntries: [{
            pathname: BROWSE_INVENTORY_ROUTE,
            search: `${heldBy}=college&qindex=${searchOption}&query=a&${shared}=true&${shared}=false`,
          }],
        });

        renderBrowseResultsList({
          filters: {
            qindex: searchOption,
            query: 'a',
            [shared]: ['true', 'false'],
            [heldBy]: ['college'],
          },
        });

        fireEvent.click(screen.getByText(defaultProps.browseData[2].callNumber));

        expect(history.location.search).toContain('?filters=shared.true%2Cshared.false%2CtenantId.college');
      });
    });
  });

  describe('when the search option is classificationAll and the Shared facet is selected', () => {
    describe('and there are no selected classification types in Settings', () => {
      describe('and user hits a classification number', () => {
        it('should be redirected to the Search lookup with the correct query', () => {
          const classificationNumber = 'BD638 .T46 2018';
          const qindex = 'classificationAll';

          history = createMemoryHistory({
            initialEntries: [{
              pathname: BROWSE_INVENTORY_ROUTE,
              search: `qindex=${qindex}&query=${classificationNumber}&classificationShared=true&classificationShared=false`,
            }],
          });

          renderBrowseResultsList({
            filters: {
              qindex,
              query: classificationNumber,
              classificationShared: ['true', 'false'],
            },
            browseData: [
              {
                classificationNumber,
                classificationTypeId: '42471af9-7d25-4f3a-bf78-60d29dcf463b',
                isAnchor: true,
                totalRecords: 1,
              },
            ]
          });

          fireEvent.click(screen.getByText(classificationNumber));

          const query = 'classifications.classificationNumber%3D%3D%22BD638%20.T46%202018%22&selectedBrowseResult=true';

          expect(history.location.search).toBe(`?filters=shared.true%2Cshared.false&qindex=querySearch&query=${query}`);
        });
      });
    });
  });

  describe('when the search option is deweyClassification and the Shared facet is selected', () => {
    describe('and one classification type is selected in Settings', () => {
      describe('and user hits a classification number', () => {
        it('should be redirected to the Search lookup with the correct query', () => {
          const classificationNumber = 'BD638 .T46 2018';
          const qindex = 'deweyClassification';

          history = createMemoryHistory({
            initialEntries: [{
              pathname: BROWSE_INVENTORY_ROUTE,
              search: `qindex=${qindex}&query=${classificationNumber}&classificationShared=true&classificationShared=false`,
            }],
          });

          renderBrowseResultsList({
            filters: {
              qindex,
              query: classificationNumber,
              classificationShared: ['true', 'false'],
            },
            browseData: [
              {
                classificationNumber,
                classificationTypeId: '42471af9-7d25-4f3a-bf78-60d29dcf463b',
                isAnchor: true,
                totalRecords: 1,
              },
            ]
          });

          fireEvent.click(screen.getByText(classificationNumber));

          const classificationTypeQuery = '%20and%20%28classifications.classificationTypeId%3D%3D%22id-dewey%22%29';
          const query = `classifications.classificationNumber%3D%3D%22BD638%20.T46%202018%22${classificationTypeQuery}&selectedBrowseResult=true`;

          expect(history.location.search).toBe(`?filters=shared.true%2Cshared.false&qindex=querySearch&query=${query}`);
        });
      });
    });
  });

  describe('when the search option is lcClassification and the Shared facet is selected', () => {
    describe('and two classification types are selected in Settings', () => {
      describe('and user hits a classification number', () => {
        it('should be redirected to the Search lookup with the correct query', () => {
          const classificationNumber = 'BD638 .T46 2018';
          const qindex = 'lcClassification';

          history = createMemoryHistory({
            initialEntries: [{
              pathname: BROWSE_INVENTORY_ROUTE,
              search: `qindex=${qindex}&query=${classificationNumber}&classificationShared=true&classificationShared=false`,
            }],
          });

          renderBrowseResultsList({
            filters: {
              qindex,
              query: classificationNumber,
              classificationShared: ['true', 'false'],
            },
            browseData: [
              {
                classificationNumber,
                classificationTypeId: '42471af9-7d25-4f3a-bf78-60d29dcf463b',
                isAnchor: true,
                totalRecords: 1,
              },
            ]
          });

          fireEvent.click(screen.getByText(classificationNumber));

          const classificationTypesQuery = '%20and%20%28classifications.classificationTypeId%3D%3D%22id-lc%22%20or%20classifications.classificationTypeId%3D%3D%22id-lc-local%22%29';
          const query = `classifications.classificationNumber%3D%3D%22BD638%20.T46%202018%22${classificationTypesQuery}&selectedBrowseResult=true`;

          expect(history.location.search).toBe(`?filters=shared.true%2Cshared.false&qindex=querySearch&query=${query}`);
        });
      });
    });
  });

  describe('when the search option is Contributors and the Shared and/or HeldBy facets are selected', () => {
    describe('and the user clicks on a record in the list', () => {
      it('should be navigated to the Search lookup with those filters', async () => {
        history = createMemoryHistory({
          initialEntries: [{
            pathname: BROWSE_INVENTORY_ROUTE,
            search: 'contributorsShared=true&contributorsShared=false&contributorsTenantId=college&qindex=contributors',
          }],
        });

        renderBrowseResultsList({
          filters: {
            qindex: 'contributors',
            contributorsShared: ['true', 'false'],
            contributorsTenantId: ['college'],
          },
          browseData: contributorsData,
        });

        fireEvent.click(screen.getByText(contributorsData[0].name));

        expect(history.location.search).toContain(
          '?filters=searchContributors.2b94c631-fca9-4892-a730-03ee529ffe2a%2Cshared.true%2Cshared.false%2CtenantId.college'
        );
      });
    });
  });

  describe('when the search option is Subjects and the Shared and/or HeldBy facets are selected', () => {
    describe('and the user clicks on a record in the list', () => {
      it('should be navigated to the Search lookup with those filters', async () => {
        history = createMemoryHistory({
          initialEntries: [{
            pathname: BROWSE_INVENTORY_ROUTE,
            search: 'qindex=browseSubjects&subjectsShared=true&subjectsShared=false&subjectsTenantId=college',
          }],
        });

        renderBrowseResultsList({
          filters: {
            qindex: 'browseSubjects',
            subjectsShared: ['true', 'false'],
            subjectsTenantId: ['college'],
          },
          browseData: subjectsData,
        });

        fireEvent.click(screen.getByText(subjectsData[0].value));

        expect(history.location.search).toContain('?filters=searchSubjectSource.sourceId%2C' +
          'searchSubjectType.typeId%2Cshared.true%2Cshared.false%2C' +
          'tenantId.college&qindex=subject&query=Trivia%20and%20miscellanea&selectedBrowseResult=true');
      });
    });
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

      beforeEach(() => {
        cleanup();
        history = createMemoryHistory({
          initialEntries: [{
            pathname: BROWSE_INVENTORY_ROUTE,
            search: 'qindex=contributors&query=A',
          }],
        });

        renderBrowseResultsList({
          browseData: [linkedRecord],
        });

        fireEvent.click(screen.getByTestId('authority-app-link'));
      });

      it('should open the authority record in a new tab', () => {
        expect(mockWindowOpen).toHaveBeenCalledWith(
          `/marc-authorities/authorities/${authorityId}?authRefType=Authorized&segment=search`,
          '_blank',
          'noopener,noreferrer'
        );
      });
    });
  });
});
