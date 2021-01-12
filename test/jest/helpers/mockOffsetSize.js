// Taken from https://github.com/bvaughn/react-virtualized-auto-sizer/blob/master/src/__tests__/AutoSizer.js
// AutoSizer uses offsetWidth and offsetHeight.
// Jest runs in JSDom which doesn't support measurements APIs.
const mockOffsetSize = (width, height) => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: height,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width,
  });
};

export default mockOffsetSize;
