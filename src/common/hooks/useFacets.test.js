import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { useFacetSettings } from '../../stores/facetsStore';
import useFacets from './useFacets';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('../../stores/facetsStore', () => ({
  useFacetSettings: jest
    .fn()
    .mockReturnValue([{ foo: { value: 'bar' }, quux: { value: 'changed' } }]),
}));

describe('useFacets', () => {
  const segmentAccordions = {
    test: true,
    foo: true,
    baz: false,
  };
  const segmentOptions = { baz: ['qux'], quux: ['corge'] };
  const selectedFacetFilters = {
    selectedFilters: { foo: { value: 'bar' } },
    facetName: 'test',
  };
  const getNewRecords = jest.fn(() => {
    return { quux: ['corge', 'grault'], garply: ['waldo'] };
  });

  const data = {
    query: { query: null, filters: 'filters' },
    onFetchFacets: jest.fn(),
    parentResources: {
      facets: { records: [[{ name: 'baz' }]], isPending: true },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({ pathname: '/path' });
    useFacetSettings.mockReturnValue([selectedFacetFilters, jest.fn()]);
  });

  describe('onFetchFacets', () => {
    const _segmentAccordions = {
      resource: false,
      format: false,
    };

    const _segmentOptions = {
      resourceTypeOptions: [],
      instanceFormatOptions: [],
    };

    const _selectedFacetFilters = {
      resource: undefined,
      format: undefined,
    };

    const _getNewRecords = jest.fn();

    const _data = {
      instanceFormats: [
        {
          'id': '8d511d33-5e85-4c5d-9bce-6e3c9cd0c324',
          'name': 'unmediated -- volume',
          'code': 'nc',
          'source': 'rdacarrier',
        },
        {
          'id': 'f5e8210f-7640-459b-a71f-552567f92369',
          'name': 'computer -- online resource',
          'code': 'cr',
          'source': 'rdacarrier',
        }, {
          'id': '5cb91d15-96b1-4b8a-bf60-ec310538da66',
          'name': 'audio -- audio disc',
          'code': 'sd',
          'source': 'rdacarrier',
        }
      ],
      resourceTypes: [
        {
          'id': '6312d172-f0cf-40f6-b27d-9fa8feaf332f',
          'name': 'text',
          'code': 'txt',
          'source': 'rdacontent',
        },
        {
          'id': '30fffe0e-e985-4144-b2e2-1e8179bdb41f',
          'name': 'unspecified',
          'code': 'zzz',
          'source': 'rdacontent',
        },
        {
          'id': '535e3160-763a-42f9-b0c0-d8ed7df6e2a2',
          'name': 'still image',
          'code': 'sti',
          'source': 'rdacontent',
        },
      ],
      query: {},
      parentResources: {
        facets: { records: [] },
      },
      onFetchFacets: jest.fn(),
    };

    describe('when user opens a facet', () => {
      it('should fetch only 6 options for this facet', () => {
        useLocation.mockReturnValue({ search: '?segment=instances&sort=title' });

        const { result } = renderHook(() => useFacets(
          _segmentAccordions,
          _segmentOptions,
          _selectedFacetFilters,
          _getNewRecords,
          _data,
        ));

        const onToggleSection = result.current[1];

        act(() => { onToggleSection({ id: 'resource' }); });

        expect(_data.onFetchFacets).toHaveBeenCalledWith({ facetToOpen: 'resource' });
      });
    });

    describe('when user clicks the "+More" button under options', () => {
      it('should fetch all options for this facet', () => {
        const mockSetFacetSettings = jest.fn();
        useFacetSettings.mockReturnValue([{}, mockSetFacetSettings]);

        const { result } = renderHook(() => useFacets(
          _segmentAccordions,
          _segmentOptions,
          _selectedFacetFilters,
          _getNewRecords,
          _data,
        ));

        const handleFetchFacets = result.current[2];
        act(() => { handleFetchFacets({ onMoreClickedFacet: 'resource' }); });

        expect(mockSetFacetSettings).toHaveBeenCalledWith('resource', { isOnMoreClicked: true });
        expect(_data.onFetchFacets).toHaveBeenCalledWith({ onMoreClickedFacet: 'resource' });
      });
    });

    describe('when user places the cursor in the facet`s input field', () => {
      it('should fetch all options for this facet', () => {
        const { result } = renderHook(() => useFacets(
          _segmentAccordions,
          _segmentOptions,
          _selectedFacetFilters,
          _getNewRecords,
          _data,
        ));

        const handleFetchFacets = result.current[2];

        act(() => { handleFetchFacets({ focusedFacet: 'resource' }); });

        expect(_data.onFetchFacets).toHaveBeenCalledWith({ focusedFacet: 'resource' });
      });
    });

    describe('when several facets are open and user enters a value in the search box', () => {
      it('should fetch options for all open facets', () => {
        useFacetSettings.mockReturnValue([{}, jest.fn()]);
        useLocation.mockReturnValue({ search: '' });

        const { result, rerender } = renderHook(({ newData }) => useFacets(
          _segmentAccordions,
          _segmentOptions,
          _selectedFacetFilters,
          _getNewRecords,
          newData,
        ), {
          initialProps: { newData: _data },
        });

        const onToggleSection = result.current[1];

        act(() => { onToggleSection({ id: 'resource' }); });
        act(() => { onToggleSection({ id: 'format' }); });

        _data.onFetchFacets.mockClear();

        useLocation.mockReturnValue({ search: '?query=Mark' });

        rerender({
          newData: {
            ..._data,
            query: { ..._data.query, query: 'Mark' },
          },
        });

        expect(_data.onFetchFacets).toHaveBeenCalledWith({
          accordions: { resource: true, format: true },
          accordionsData: {},
          facetsAlwaysRequiredAllOptions: {},
        });
      });
    });

    describe('when several facets are open and user selects an option of any facet', () => {
      it('should fetch options for all open facets', () => {
        useFacetSettings.mockReturnValue([{}, jest.fn()]);
        useLocation.mockReturnValue({ search: '' });
        const isFetchFacetsAfterReset = false;

        const { result, rerender } = renderHook(({ newData, newSelectedFacetFilters }) => useFacets(
          _segmentAccordions,
          _segmentOptions,
          newSelectedFacetFilters,
          _getNewRecords,
          newData,
          isFetchFacetsAfterReset,
        ), {
          initialProps: {
            newData: _data,
            newSelectedFacetFilters: _selectedFacetFilters,
          },
        });

        const onToggleSection = result.current[1];

        act(() => { onToggleSection({ id: 'resource' }); });
        act(() => { onToggleSection({ id: 'format' }); });

        _data.onFetchFacets.mockClear();

        useLocation.mockReturnValue({ search: '?callNumbersTenantId=university&qindex=callNumbers' });

        rerender({
          newData: {
            ..._data,
            query: { ..._data.query, filters: 'resource.6312d172-f0cf-40f6-b27d-9fa8feaf332f' },
          },
          newSelectedFacetFilters: { ..._selectedFacetFilters, resource: ['6312d172-f0cf-40f6-b27d-9fa8feaf332f'] },
        });

        expect(_data.onFetchFacets).toHaveBeenCalledWith({
          accordions: { resource: true, format: true },
          accordionsData: {
            resource: { isSelected: true },
          },
          facetsAlwaysRequiredAllOptions: {},
        });
      });
    });

    describe('when there is a value in the search box and any facet option is selected', () => {
      describe('and the user selects another search option', () => {
        it('should not call onFetchFacets', () => {
          useFacetSettings.mockReturnValue([{}, jest.fn()]);
          useLocation.mockReturnValue({ search: '?callNumbersTenantId=university&qindex=callNumbers&query=Mark' });
          const isFetchFacetsAfterReset = false;

          const { rerender } = renderHook(({ newData, newSelectedFacetFilters }) => useFacets(
            _segmentAccordions,
            _segmentOptions,
            newSelectedFacetFilters,
            _getNewRecords,
            newData,
            isFetchFacetsAfterReset,
          ), {
            initialProps: {
              newData: {
                ..._data,
                query: {
                  ..._data.query,
                  query: 'Mark',
                  qindex: 'callNumbers',
                  filters: 'resource.6312d172-f0cf-40f6-b27d-9fa8feaf332f',
                },
              },
              newSelectedFacetFilters: { ..._selectedFacetFilters, resource: ['6312d172-f0cf-40f6-b27d-9fa8feaf332f'] },
            },
          });

          _data.onFetchFacets.mockClear();

          useLocation.mockReturnValue('');

          rerender({
            newData: {
              ..._data,
              query: {
                ..._data.query,
                query: undefined,
                qindex: 'local',
                filters: undefined,
              },
            },
            newSelectedFacetFilters: _selectedFacetFilters,
          });

          expect(_data.onFetchFacets).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the "Search" lookup and there is a value in the search box and facet option is selected', () => {
      describe('and the user reset the search', () => {
        it('should call onFetchFacets for all open facets once', () => {
          useFacetSettings.mockReturnValue([{}, jest.fn()]);
          useLocation.mockReturnValue({ search: '?segment=instances&sort=title&query=Mark' });

          const { result, rerender } = renderHook(({ newData, newSelectedFacetFilters }) => useFacets(
            _segmentAccordions,
            _segmentOptions,
            newSelectedFacetFilters,
            _getNewRecords,
            newData,
          ), {
            initialProps: {
              newData: {
                ..._data,
                query: {
                  ..._data.query,
                  query: 'Mark',
                  qindex: '',
                  filters: 'resource.6312d172-f0cf-40f6-b27d-9fa8feaf332f',
                },
              },
              newSelectedFacetFilters: { ..._selectedFacetFilters, resource: ['6312d172-f0cf-40f6-b27d-9fa8feaf332f'] },
            },
          });

          const onToggleSection = result.current[1];

          act(() => { onToggleSection({ id: 'resource' }); });

          _data.onFetchFacets.mockClear();

          useLocation.mockReturnValue({ search: '' });

          rerender({
            newData: {
              ..._data,
              query: {
                ..._data.query,
                query: undefined,
                qindex: undefined,
                filters: undefined,
              },
            },
            newSelectedFacetFilters: _selectedFacetFilters,
          });

          expect(_data.onFetchFacets).toHaveBeenCalledTimes(1);
          expect(_data.onFetchFacets).toHaveBeenCalledWith({
            accordions: { format: false, resource: true },
            accordionsData: expect.anything(),
            facetsAlwaysRequiredAllOptions: {},
          });
        });
      });
    });

    describe('when the "Browse" lookup and there is a value in the search box and facet option is selected', () => {
      describe('and the user reset the search', () => {
        it('should not call onFetchFacets', () => {
          useFacetSettings.mockReturnValue([{}, jest.fn()]);
          useLocation.mockReturnValue({ search: '?query=Mark' });
          const isFetchFacetsAfterReset = false;

          const { result, rerender } = renderHook(({ newData, newSelectedFacetFilters }) => useFacets(
            _segmentAccordions,
            _segmentOptions,
            newSelectedFacetFilters,
            _getNewRecords,
            newData,
            isFetchFacetsAfterReset,
          ), {
            initialProps: {
              newData: {
                ..._data,
                query: {
                  ..._data.query,
                  query: 'Mark',
                  qindex: '',
                  filters: 'resource.6312d172-f0cf-40f6-b27d-9fa8feaf332f',
                },
              },
              newSelectedFacetFilters: { ..._selectedFacetFilters, resource: ['6312d172-f0cf-40f6-b27d-9fa8feaf332f'] },
            },
          });

          const onToggleSection = result.current[1];

          act(() => { onToggleSection({ id: 'resource' }); });

          _data.onFetchFacets.mockClear();

          useLocation.mockReturnValue({ search: '' });

          rerender({
            newData: {
              ..._data,
              query: {
                ..._data.query,
                query: undefined,
                qindex: undefined,
                filters: undefined,
              },
            },
            newSelectedFacetFilters: _selectedFacetFilters,
          });

          expect(_data.onFetchFacets).not.toHaveBeenCalled();
        });
      });
    });
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));
    expect(result.current[0]).toEqual(segmentAccordions);
  });

  it('updates accordions state on new toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[1]({ id: 'foo' });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: false,
    });
  });

  it('updates accordions state on open toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[2]({
        onMoreClickedFacet: true,
        focusedFacet: '',
        facetToOpen: true,
        dateFacet: true,
      });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates accordions state on segment toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      {},
      getNewRecords,
      data
    ));

    act(() => {
      result.current[2]({
        onMoreClickedFacet: true,
        focusedFacet: '',
        facetToOpen: true,
        dateFacet: true,
      });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates accordions state on records toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[2]({
        onMoreClickedFacet: true,
        focusedFacet: '',
        facetToOpen: false,
        dateFacet: true,
      });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates accordions state on facet toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[2]({
        onMoreClickedFacet: false,
        focusedFacet: true,
        facetToOpen: false,
        dateFacet: true,
      });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates accordions state on date toggle', () => {
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[2]({
        onMoreClickedFacet: false,
        focusedFacet: true,
        facetToOpen: false,
        dateFacet: false,
      });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates facet settings on data filter search', () => {
    const spy = jest.spyOn(React, 'useRef');
    spy.mockImplementation(() => {
      return { current: {}, ...segmentAccordions };
    });
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      selectedFacetFilters,
      getNewRecords,
      data
    ));

    act(() => {
      result.current[3]({ name: 'quux', value: 'changed' });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });

  it('updates facet settings on accordions filter search', () => {
    const spy = jest.spyOn(React, 'useRef');
    spy.mockImplementation(() => {
      return { current: { test: ['ere'] }, ...segmentAccordions };
    });
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      { selectedFilters: undefined, facetName: 'test' },
      getNewRecords,
      data
    ));
    act(() => {
      result.current[3]({ name: 'quux', value: 'changed' });
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });
  it('updates facet settings on selected filter search', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {},
    });
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      {
        selectedFilters: undefined,
        facetName: 'test',
      },
      getNewRecords,
      data
    ));

    act(() => {
      result.current[5]('test');
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });
  it('updates facet settings on facet filter search', () => {
    const spy = jest.spyOn(React, 'useRef');
    spy.mockImplementation(() => {
      return {
        current: {
          test: ['ere'],
          prevFacetValue: 'test',
          selectedFilters: ['hggh'],
          facetName: 'test',
        },
        ...segmentAccordions,
      };
    });
    const { result } = renderHook(() => useFacets(
      segmentAccordions,
      segmentOptions,
      {
        selectedFilters: undefined,
        facetName: 'test',
      },
      getNewRecords,
      data
    ));

    act(() => {
      result.current[5]('test');
    });
    expect(result.current[0]).toEqual({
      ...segmentAccordions,
      foo: true,
    });
  });
  it('updates facet settings on ref filter search', () => {
    const spy = jest.spyOn(React, 'useRef');
    spy.mockImplementation(() => {
      return {
        current: { test: ['ere'], prevFacetValue: 'test', facetName: 'test' },
        ...segmentAccordions,
      };
    });
    const { result } = renderHook(() => useFacets(
      { foo: false },
      segmentOptions,
      {
        selectedFilters: undefined,
        facetName: 'test',
      },
      getNewRecords,
      data
    ));
    act(() => {
      result.current[5]('test');
    });
    expect(result.current[0]).toEqual({
      foo: false,
    });
  });
});
