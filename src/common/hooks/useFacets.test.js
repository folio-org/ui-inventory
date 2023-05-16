import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';
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
