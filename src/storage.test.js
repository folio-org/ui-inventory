import { getItem, setItem } from './storage';

describe('Session Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  describe('getItem', () => {
    it('return null if sessionStorage is empty', () => {
      expect(getItem('test')).toBe(null);
    });
    it('getItem should retrieve an item from session storage', () => {
      setItem('itemName', 'itemValue');
      expect(getItem('itemName')).toBe('itemValue');
    });
    it('return the stored value if it exists', () => {
      sessionStorage.setItem('test', JSON.stringify({ value: 'testValue' }));
      expect(getItem('test')).toEqual({ value: 'testValue' });
    });
    it('return null if the value can\'t be parsed', () => {
      sessionStorage.setItem('test', 'invalid JSON');
      expect(getItem('test')).toBe(null);
    });
  });
  describe('setItem', () => {
    it('should store the value in sessionStorage', () => {
      setItem('test', { value: 'testValue' });
      expect(sessionStorage.getItem('test')).toBe(JSON.stringify({ value: 'testValue' }));
    });
    it('setItem should store an item in session storage', () => {
      setItem('itemName', 'itemValue');
      expect(sessionStorage.getItem('itemName')).toBe('"itemValue"');
    });
  });
});
