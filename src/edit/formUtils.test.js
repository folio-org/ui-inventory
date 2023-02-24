import { memoize, mutators } from './formUtils';

describe('memoize', () => {
  it('returns a function', () => {
    const fn = jest.fn();
    const memoizedFn = memoize(fn);
    expect(typeof memoizedFn).toBe('function');
  });
  it('memoizes function results', () => {
    const fn = jest.fn(x => x * 2);
    const memoizedFn = memoize(fn);
    memoizedFn(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('returns memoized result', () => {
    const fn = jest.fn(x => x * 2);
    const memoizedFn = memoize(fn);
    const result1 = memoizedFn(4);
    const result2 = memoizedFn(4);
    expect(result1).toBe(result2);
  });
  it('returns result of function for new argument', () => {
    const fn = jest.fn(x => x * 2);
    const memoizedFn = memoize(fn);
    const result = memoizedFn(4);
    const newResult = memoizedFn(10);
    expect(newResult).toBe(20);
    expect(result).not.toBe(newResult);
  });
});

describe('mutators', () => {
  it('updates the value of a state property', () => {
    const valueState = { value1: 'original value 1', value2: 'original value 2' };
    const utils = {
      changeValue: jest.fn((state, name, updateFn) => {
        state[name] = updateFn();
      }),
    };
    mutators.updateValue(['value1', 'new value 1'], valueState, utils);
    expect(valueState).toEqual({ value1: 'new value 1', value2: 'original value 2' });
    expect(utils.changeValue).toHaveBeenCalledWith(valueState, 'value1', expect.any(Function));
  });
});
