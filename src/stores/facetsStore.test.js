import facetsStore, { getSearchTerm } from './facetsStore';

const getFacetSettings = () => facetsStore.getState().facetSettings;

describe('facetsStore', () => {
  beforeEach(() => {
    const { resetFacetSettings } = facetsStore.getState();
    resetFacetSettings();
  });

  describe('setFacetSettings', () => {
    test('setting value', () => {
      const { setFacetSettings } = facetsStore.getState();
      setFacetSettings('test', { value: 2 });
      expect(getFacetSettings()).toEqual({ test: { value: 2 } });
    });

    test('setting value with pre existing values', () => {
      const { setFacetSettings } = facetsStore.getState();
      setFacetSettings('test1', { value: 1 });
      setFacetSettings('test2', { value: 2 });

      expect(getFacetSettings()).toEqual({ test1: { value: 1 }, test2: { value: 2 } });
    });
  });

  describe('resetFacetSettings', () => {
    test('resetting values', () => {
      const { setFacetSettings, resetFacetSettings } = facetsStore.getState();
      setFacetSettings('test1', { value: 1 });
      resetFacetSettings();

      expect(getFacetSettings()).toEqual({});
    });
  });

  describe('resetFacetByName', () => {
    test('resetting values', () => {
      const { setFacetSettings, resetFacetByName } = facetsStore.getState();
      setFacetSettings('test1', { value: 1 });
      resetFacetByName('test1');

      expect(getFacetSettings()).toEqual({});
    });
  });

  describe('getSearchTerm', () => {
    test('getting search term value', () => {
      const { setFacetSettings } = facetsStore.getState();
      setFacetSettings('test', { value: 2 });

      expect(getSearchTerm('test')).toEqual(2);
    });
  });
});
