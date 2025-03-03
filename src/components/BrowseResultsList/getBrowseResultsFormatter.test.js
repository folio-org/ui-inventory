import '../../../test/jest/__mock__';

import { act, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import queryString from 'query-string';

import { MultiColumnList } from '@folio/stripes-components';
import {
  browseCallNumberOptions,
  browseModeOptions,
  queryIndexes,
} from '@folio/stripes-inventory-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import {
  BROWSE_INVENTORY_ROUTE,
  INVENTORY_ROUTE,
} from '../../constants';
import {
  COLUMNS_MAPPING,
  VISIBLE_COLUMNS_MAP,
} from './constants';
import getBrowseResultsFormatter from './getBrowseResultsFormatter';

window.open = jest.fn();
let history;

const data = {
  contributorNameTypes: [{ id: 'contributorNameTypeId', name: 'nameType' }],
  contributorTypes: [{ id: 'contributorTypeId', name: 'type' }],
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
      shelvingAlgorithm: 'dewey',
      typeIds: ['dewey-id', 'lc-id'],
    },
  ],
  subjectSources: [{ id: 'sourceId1', name: 'sourceName1' }, { id: 'sourceId2', name: 'sourceName2' }],
  subjectTypes: [{ id: 'typeId1', name: 'typeName1' }, { id: 'typeId2', name: 'typeName2' }],
};
const missedMatchText = 'would be here';

const renderComponent = ({
  contentData,
  formatter,
  visibleColumns,
  ...props
}) => {
  return renderWithIntl(
    <Router history={history}>
      <MultiColumnList
        contentData={contentData}
        columnMapping={COLUMNS_MAPPING}
        formatter={formatter}
        visibleColumns={visibleColumns}
        {...props}
      />
    </Router>,
    translationsProperties,
  );
};

describe('getBrowseResultsFormatter', () => {
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: [{ pathname: BROWSE_INVENTORY_ROUTE }],
    });
  });

  describe('Call numbers', () => {
    const formatter = getBrowseResultsFormatter({
      data,
      browseOption: browseModeOptions.CALL_NUMBERS,
      isNewCallNumberBrowseAvailable: false,
    });
    const missedMatchRecord = {
      isAnchor: true,
      fullCallNumber: 'bla bla',
      totalRecords: 0,
    };
    const contentData = [
      {
        fullCallNumber: 'A 1958 A 8050',
        shelfKey: '41958 A 48050',
        isAnchor: true,
        totalRecords: 1,
        instance: { id: 'ce9dd893-c812-49d5-8973-d55d018894c4', title: 'Test title' },
      },
      {
        fullCallNumber: 'AAA',
        shelfKey: '123456',
        totalRecords: 2,
        instance: { id: 'ce9dd893-c812-49d5-8973-d55d018894c4', title: 'Test title 2' },
      },
    ];
    const [anchorRecord, nonAnchorRecord] = contentData;

    const renderCallNumberList = (params = {}) => renderComponent({
      visibleColumns: VISIBLE_COLUMNS_MAP[browseModeOptions.CALL_NUMBERS],
      contentData,
      formatter,
      ...params,
    });

    it('should render call number\'s rows', () => {
      const newFormatter = getBrowseResultsFormatter({
        data,
        browseOption: browseModeOptions.CALL_NUMBERS,
        isNewCallNumberBrowseAvailable: false,
      });

      renderCallNumberList({
        formatter: newFormatter,
      });

      // Anchor row
      expect(screen.getByText(anchorRecord.fullCallNumber).tagName.toLowerCase()).toBe('strong');
      expect(screen.getByText(anchorRecord.totalRecords).tagName.toLowerCase()).toBe('strong');
      expect(screen.getByText(anchorRecord.instance.title).tagName.toLowerCase()).toBe('strong');
      // Default row
      expect(screen.getByText(nonAnchorRecord.fullCallNumber).tagName.toLowerCase()).not.toBe('strong');
      expect(screen.getByText(nonAnchorRecord.totalRecords).tagName.toLowerCase()).not.toBe('strong');
      expect(screen.getByText(nonAnchorRecord.instance.title).tagName.toLowerCase()).not.toBe('strong');
    });

    it('should render \'Missed match item\' row', () => {
      renderCallNumberList({ contentData: [missedMatchRecord] });

      expect(screen.getByText(missedMatchRecord.fullCallNumber)).toBeInTheDocument();
      expect(screen.getByText(missedMatchText)).toBeInTheDocument();
    });

    it('should navigate to instance "Search" page when target column was clicked', async () => {
      const newFormatter = getBrowseResultsFormatter({
        data,
        browseOption: browseModeOptions.CALL_NUMBERS,
        isNewCallNumberBrowseAvailable: false,
      });

      renderCallNumberList({
        formatter: newFormatter,
      });

      expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);

      await act(async () => fireEvent.click(screen.getByText(anchorRecord.fullCallNumber)));

      expect(history.location.pathname).toEqual(INVENTORY_ROUTE);
    });

    describe('when `browse` 1.5 interface is available', () => {
      const _formatter = getBrowseResultsFormatter({
        data,
        browseOption: browseModeOptions.CALL_NUMBERS,
        isNewCallNumberBrowseAvailable: true,
      });
      const _missedMatchRecord = {
        isAnchor: true,
        fullCallNumber: 'bla bla',
        callNumber: 'bla bla',
        totalRecords: 0,
      };
      const _contentData = [
        {
          fullCallNumber: 'CALL',
          isAnchor: true,
          totalRecords: 0,
        },
        {
          fullCallNumber: 'CALL SUF',
          callNumber: 'CALL',
          callNumberPrefix: 'PRE',
          callNumberSuffix: 'SUF',
          totalRecords: 2,
        },
      ];
      const [_anchorRecord, _nonAnchorRecord] = _contentData;

      const _renderCallNumberList = (params = {}) => renderComponent({
        visibleColumns: VISIBLE_COLUMNS_MAP[browseModeOptions.CALL_NUMBERS],
        contentData: _contentData,
        formatter: _formatter,
        ...params,
      });

      it('should render call number\'s rows', () => {
        _renderCallNumberList();

        // Anchor row
        expect(screen.getByText('would be here').tagName.toLowerCase()).toBe('strong');
        expect(screen.getByText('CALL').tagName.toLowerCase()).not.toBe('strong');
        // Default row
        expect(screen.getByText('PRE CALL SUF').tagName.toLowerCase()).not.toBe('strong');
        expect(screen.getByText(_nonAnchorRecord.totalRecords).tagName.toLowerCase()).not.toBe('strong');
      });

      it('should render \'Missed match item\' row', () => {
        _renderCallNumberList({ contentData: [_missedMatchRecord] });

        expect(screen.getByText(_missedMatchRecord.callNumber)).toBeInTheDocument();
        expect(screen.getByText(missedMatchText)).toBeInTheDocument();
      });

      it('should not navigate to any page when anchor is clicked', async () => {
        _renderCallNumberList();

        expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);

        await act(async () => fireEvent.click(screen.getByText(_anchorRecord.fullCallNumber)));

        expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);
      });

      describe('when call number title is clicked', () => {
        it('should navigate to the instance "Search" page', async () => {
          const { getByText } = _renderCallNumberList({
            formatter: getBrowseResultsFormatter({
              data,
              browseOption: browseCallNumberOptions.DEWEY,
              isNewCallNumberBrowseAvailable: true,
            }),
          });

          const query = queryString.stringify({
            selectedBrowseResult: true,
            qindex: queryIndexes.QUERY_SEARCH,
            query: 'itemFullCallNumbers="PRE CALL SUF" and (item.effectiveCallNumberComponents.typeId=="dewey-id" or item.effectiveCallNumberComponents.typeId=="lc-id")',
          });

          expect(getByText('PRE CALL SUF').href).toContain(`${INVENTORY_ROUTE}?${query}`);
        });
      });
    });
  });

  describe('Contributors', () => {
    beforeEach(() => {
      window.open.mockClear();
    });

    const formatter = getBrowseResultsFormatter({
      data,
      browseOption: browseModeOptions.CONTRIBUTORS,
      isNewCallNumberBrowseAvailable: false,
    });
    const missedMatchRecord = {
      isAnchor: true,
      name: 'bla bla',
      totalRecords: 0,
    };
    const contentData = [
      {
        isAnchor: true,
        name: 'Abe, Etsuo, 1949',
        contributorTypeId: ['contributorTypeId'],
        contributorNameTypeId: 'contributorNameTypeId',
        totalRecords: 2,
      },
      {
        authorityId: 'authorityId',
        name: 'Antoniou, Grigoris',
        contributorTypeId: ['contributorTypeId'],
        contributorNameTypeId: 'contributorNameTypeId',
        totalRecords: 1,
      },
      {
        name: 'Antoniou, Grigoris 2',
        contributorTypeId: ['contributorTypeId'],
        contributorNameTypeId: 'contributorNameTypeId',
        totalRecords: 0,
        isAnchor: false,
      }
    ];
    const [anchorRecord, nonAnchorRecord, notClickableRecord] = contentData;

    const renderContributorsList = (params = {}) => renderComponent({
      contentData,
      formatter,
      visibleColumns: VISIBLE_COLUMNS_MAP[browseModeOptions.CONTRIBUTORS],
      ...params,
    });

    it('should render contributor\'s rows', () => {
      renderContributorsList();

      // Anchor row
      expect(screen.getByText(anchorRecord.name).tagName.toLowerCase()).toBe('strong');
      expect(screen.getByText(anchorRecord.totalRecords).tagName.toLowerCase()).toBe('strong');
      // Default row
      expect(screen.getByText(nonAnchorRecord.name).tagName.toLowerCase()).not.toBe('strong');
      expect(screen.getByText(nonAnchorRecord.totalRecords).tagName.toLowerCase()).not.toBe('strong');
      // Non clickable row
      expect(screen.getByText(notClickableRecord.name).tagName.toLowerCase()).not.toBe('strong');
      expect(screen.getByText(notClickableRecord.totalRecords).tagName.toLowerCase()).not.toBe('strong');
    });

    it('should render \'Missed match item\' rows', () => {
      renderContributorsList({ contentData: [missedMatchRecord] });

      expect(screen.getByText(missedMatchRecord.name)).toBeInTheDocument();
      expect(screen.getByText(missedMatchText)).toBeInTheDocument();
    });

    it('should navigate to instance "Search" page when target column was clicked', async () => {
      renderContributorsList();

      expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);

      await act(async () => fireEvent.click(screen.getByText(anchorRecord.name)));

      expect(history.location.pathname).toEqual(INVENTORY_ROUTE);
    });

    it('should not navigate to instance "Search" page when not clickable target column was clicked', async () => {
      renderContributorsList();

      expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);

      await act(async () => fireEvent.click(screen.getByText(notClickableRecord.name)));

      expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);
    });

    it('should open the record in MARC authority app in new tab when "authority" icon was clicked', async () => {
      renderContributorsList();

      await act(async () => fireEvent.click(screen.getByTestId('authority-app-link')));

      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('/marc-authorities/authorities'), '_blank', 'noopener,noreferrer');
    });
  });

  describe('Subjects', () => {
    const formatter = getBrowseResultsFormatter({
      data,
      browseOption: browseModeOptions.SUBJECTS,
      isNewCallNumberBrowseAvailable: false,
    });
    const missedMatchRecord = {
      isAnchor: true,
      value: 'bla bla',
      totalRecords: 0,
    };
    const contentData = [
      {
        isAnchor: true,
        value: 'Africa Politics and government 20th century',
        sourceId: 'sourceId1',
        typeId: 'typeId1',
        totalRecords: 1,
      },
      {
        value: 'Corporate governance',
        sourceId: 'sourceId2',
        typeId: 'typeId2',
        totalRecords: 2,
      }
    ];
    const [anchorRecord, nonAnchorRecord] = contentData;

    const renderSubjectsList = (params = {}) => renderComponent({
      contentData,
      formatter,
      visibleColumns: VISIBLE_COLUMNS_MAP[browseModeOptions.SUBJECTS],
      ...params,
    });

    it('should render subject\'s rows', () => {
      renderSubjectsList();

      // Anchor row
      expect(screen.getByText(anchorRecord.value).tagName.toLowerCase()).toBe('strong');
      expect(screen.getByText('sourceName1')).toBeInTheDocument();
      expect(screen.getByText('typeName1')).toBeInTheDocument();
      expect(screen.getByText(anchorRecord.totalRecords).tagName.toLowerCase()).toBe('strong');
      // Default row
      expect(screen.getByText(nonAnchorRecord.value).tagName.toLowerCase()).not.toBe('strong');
      expect(screen.getByText('sourceName2')).toBeInTheDocument();
      expect(screen.getByText('typeName2')).toBeInTheDocument();
      expect(screen.getByText(nonAnchorRecord.totalRecords).tagName.toLowerCase()).not.toBe('strong');
    });

    it('should render \'Missed match item\' rows', () => {
      renderSubjectsList({ contentData: [missedMatchRecord] });

      expect(screen.getByText(missedMatchRecord.value)).toBeInTheDocument();
      expect(screen.getByText(missedMatchText)).toBeInTheDocument();
    });

    it('should navigate to instance "Search" page when target column was clicked', async () => {
      renderSubjectsList();

      expect(history.location.pathname).toEqual(BROWSE_INVENTORY_ROUTE);

      await act(async () => fireEvent.click(screen.getByText(anchorRecord.value)));

      expect(history.location.pathname).toEqual(INVENTORY_ROUTE);
    });
  });

  describe('Classification', () => {
    const classificationNumber = 'BD638 .T46 2018';

    const formatter = getBrowseResultsFormatter({
      browseOption: browseModeOptions.CLASSIFICATION_ALL,
      filters: {
        qindex: 'classificationAll',
        query: classificationNumber,
      },
      data,
      isNewCallNumberBrowseAvailable: false,
    });
    const missedMatchRecord = {
      classificationNumber: 'foo',
      isAnchor: true,
      totalRecords: 0,
    };
    const contentData = [
      {
        classificationNumber,
        classificationTypeId: '42471af9-7d25-4f3a-bf78-60d29dcf463b',
        isAnchor: true,
        totalRecords: 1,
      },
      {
        classificationNumber: '981. 06',
        classificationTypeId: '42471af9-7d25-4f3a-bf78-60d29dcf463b',
        totalRecords: 2,
      },
    ];
    const [anchorRecord] = contentData;

    const renderClassificationList = (params = {}) => renderComponent({
      visibleColumns: ['classificationNumber', 'numberOfTitles'],
      contentData,
      formatter,
      ...params,
    });

    describe('when search query coincides with one of the classification numbers in the results', () => {
      it('should make this number bold', () => {
        const { getByText } = renderClassificationList();

        expect(getByText(anchorRecord.classificationNumber).tagName.toLowerCase()).toBe('strong');
        expect(getByText(anchorRecord.totalRecords).tagName.toLowerCase()).toBe('strong');
      });
    });

    it('should render \'Missed match item\' row', () => {
      const { getByText } = renderClassificationList({ contentData: [missedMatchRecord] });

      expect(getByText(missedMatchRecord.classificationNumber)).toBeInTheDocument();
      expect(getByText(missedMatchText)).toBeInTheDocument();
    });
  });
});
