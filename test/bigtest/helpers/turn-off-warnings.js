const warn = console.warn;
const warnblockedlist = [
  /componentWillReceiveProps has been renamed/,
  /componentWillUpdate has been renamed/,
  /componentWillMount has been renamed/,
  /formatjs/,
  /SafeHTMLMessage/
];


const error = console.error;
const errorBlockedlist = [
  /React Intl/,
  /Cannot update a component from inside the function body of a different component/,
  /Can't perform a React state update on an unmounted component./,
  /Invalid prop `component` supplied to.*Field/,
  /Each child in a list/,
  /Failed prop type/,
  /component is changing an uncontrolled/,
  /validateDOMNesting/,
  /Invalid ARIA attribute/,
  /Unknown event handler property/,
  /formatjs/
];


export default function turnOffWarnings() {
  console.warn = function (...args) {
    if (warnblockedlist.some(rx => rx.test(args[0]))) {
      return;
    }
    warn.apply(console, args);
  };

  console.error = function (...args) {
    if (errorBlockedlist.some(rx => rx.test(args[0]))) {
      return;
    }
    error.apply(console, args);
  };
}
