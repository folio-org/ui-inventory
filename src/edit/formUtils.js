export function memoize(fn) {
  let lastArg;
  let lastResult;

  return arg => {
    if (arg !== lastArg) {
      lastArg = arg;
      lastResult = fn(arg);
    }

    return lastResult;
  };
}

export const mutators = {
  updateValue: ([name, newValue], state, utils) => {
    utils.changeValue(state, name, () => newValue);
  },
};
