import {
  AFTER,
  BEFORE,
  CLOSE_BRACKET,
  OPEN_BRACKET,
  SPACE,
  SLASH,
} from './constants';

export const getSearchOption = (val, notEditableValueBefore, notEditableValueAfter) => {
  return val
    .replace(notEditableValueBefore, '')
    .replace(notEditableValueAfter, '')
    .replace(/^\(/, '')
    .replace(/^"|"$/g, '');
};

export const setCaretPosition = (textareaRef, caretPos) => {
  textareaRef.current?.setSelectionRange(caretPos, caretPos);
};

const isValueToInsertAlreadyQuoted = (valueToInsert) => {
  const val = valueToInsert.replace(/[()]/g, '');
  return val.startsWith('"') && val.endsWith('"');
};

const isAllQuotesExist = (val) => {
  let quotes = '';

  for (const char of val) {
    if (char === '"') {
      quotes += char;
    }
  }
  return !(quotes.length % 2);
};

const processValueWithSpace = (valueToInsert) => {
  if (isValueToInsertAlreadyQuoted(valueToInsert)) {
    return valueToInsert;
  }

  const valueWithoutQuotesAndBracketsAround = valueToInsert.replace(/^\(|\)$/g, '').replace(/^"|"$/g, '');

  if (valueToInsert.startsWith(OPEN_BRACKET) && !valueToInsert.includes(CLOSE_BRACKET)) {
    return `${OPEN_BRACKET}"${valueWithoutQuotesAndBracketsAround}"`;
  }
  if (valueToInsert.endsWith(CLOSE_BRACKET) && !valueToInsert.includes(OPEN_BRACKET)) {
    return `"${valueWithoutQuotesAndBracketsAround}"${CLOSE_BRACKET}`;
  }
  if (valueToInsert.startsWith(OPEN_BRACKET)) {
    return `${OPEN_BRACKET}"${valueToInsert.slice(1)}"`;
  }
  if (
    valueToInsert.startsWith('"') &&
    !valueToInsert.trim().endsWith('"') &&
    isAllQuotesExist(valueToInsert)
  ) {
    return valueToInsert;
  }
  return `"${valueToInsert}"`;
};

export const findBoolOperator = (booleanOperators, val, i, flag) => {
  const twoCharacterBoolOperLength = 2;
  const threeCharacterBoolOperLength = 3;
  let twoCharacterBoolOper;
  let threeCharacterBoolOper;
  let inferredTwoCharacterBoolOper;
  let inferredThreeCharacterBoolOper;

  if (flag === BEFORE) {
    inferredTwoCharacterBoolOper = val.slice(i - 3, i).trim();
    inferredThreeCharacterBoolOper = val.slice(i - 4, i).trim();
    twoCharacterBoolOper = inferredTwoCharacterBoolOper.length === twoCharacterBoolOperLength &&
      inferredTwoCharacterBoolOper.toLowerCase();
    threeCharacterBoolOper = inferredThreeCharacterBoolOper.length === threeCharacterBoolOperLength &&
      inferredThreeCharacterBoolOper.toLowerCase();
  } else {
    inferredTwoCharacterBoolOper = val.slice(i + 1, i + 4).trim();
    inferredThreeCharacterBoolOper = val.slice(i + 1, i + 5).trim();
    twoCharacterBoolOper = inferredTwoCharacterBoolOper.length === twoCharacterBoolOperLength &&
      inferredTwoCharacterBoolOper.toLowerCase();
    threeCharacterBoolOper = inferredThreeCharacterBoolOper.length === threeCharacterBoolOperLength &&
      inferredThreeCharacterBoolOper.toLowerCase();
  }

  const booleanOperator = booleanOperators.find(boolOper => (
    boolOper.label.toLowerCase() === twoCharacterBoolOper ||
    boolOper.label.toLowerCase() === threeCharacterBoolOper
  ));
  return booleanOperator || {};
};

const addQuotesIfNeeded = (val) => {
  if (!val.includes(SPACE)) {
    return val;
  }
  const isValueQuoted = val.startsWith('"') && val.endsWith('"');
  return isValueQuoted ? val : `"${val}"`;
};

const addQuotesToTermItems = (valueToInsert, booleanOperators) => {
  const valueWithoutBrackets = valueToInsert.replace(/^\(|\)$/g, '');
  const spaceLength = 1;
  let quotedTermItems = '';
  let termItem = '';
  let continueCount = 0;

  for (let i = 0; i < valueWithoutBrackets.length; i++) {
    const char = valueWithoutBrackets[i];
    if (continueCount) {
      continueCount--;
      // eslint-disable-next-line
      continue;
    }

    if (char === SPACE) {
      const { label: boolOperator } = findBoolOperator(booleanOperators, valueWithoutBrackets, i, AFTER);

      if (boolOperator) {
        quotedTermItems += quotedTermItems
          ? `${SPACE}${addQuotesIfNeeded(termItem)}${SPACE}${boolOperator}`
          : `${addQuotesIfNeeded(termItem)}${SPACE}${boolOperator}`;

        termItem = '';
        continueCount = boolOperator.length + spaceLength;
      } else {
        termItem += char;
      }
    } else {
      termItem += char;
    }
  }
  quotedTermItems += `${SPACE}${addQuotesIfNeeded(termItem)}`;
  return `${OPEN_BRACKET}${quotedTermItems}${CLOSE_BRACKET}`;
};

const isEvenNumberOfBrackets = (val) => {
  let brackets = '';

  for (const char of val) {
    if (char === OPEN_BRACKET || char === CLOSE_BRACKET) {
      brackets += char;
    }
  }

  return !(brackets.length % 2);
};

export const addQuotes = (valueToInsert, booleanOperators) => {
  if (
    valueToInsert.startsWith(OPEN_BRACKET) &&
    valueToInsert.endsWith(CLOSE_BRACKET) &&
    isEvenNumberOfBrackets(valueToInsert)
  ) {
    return addQuotesToTermItems(valueToInsert, booleanOperators);
  }
  if (valueToInsert.includes(SPACE)) {
    return processValueWithSpace(valueToInsert);
  }
  if (valueToInsert.startsWith(OPEN_BRACKET)) {
    if (valueToInsert.includes(SLASH)) {
      return `${OPEN_BRACKET}"${valueToInsert.slice(1)}"`;
    }
    return `${OPEN_BRACKET}${valueToInsert.slice(1)}`;
  }
  if (valueToInsert.endsWith(CLOSE_BRACKET)) {
    if (valueToInsert.includes(SLASH)) {
      return `"${valueToInsert.slice(0, -1)}"${CLOSE_BRACKET}`;
    }
    return `${valueToInsert.slice(0, -1)}${CLOSE_BRACKET}`;
  }
  if (valueToInsert.includes(SLASH)) {
    return `"${valueToInsert.replace(/^"|"$/g, '')}"`;
  }
  return valueToInsert;
};

export const isValueFromOptions = (val, options) => {
  return options.some(option => {
    return option.label.toLowerCase() === val.trim().toLowerCase();
  });
};

export const isSomeOptionIncludesValue = (val, options) => {
  return options.some(option => {
    return option.label.toLowerCase()
      .includes(val.toLowerCase());
  });
};

export const moveScrollToDown = (optionsContainerRef, optionRef, isLastOption) => {
  const optionsContainerElement = optionsContainerRef.current;
  const optionElement = optionRef.current;

  if (isLastOption) {
    optionsContainerElement.scrollTop = 0;
  } else if (optionElement) {
    const optionPosition = optionElement.offsetTop + optionElement.offsetHeight;
    const optionsContainerPosition =
      optionsContainerElement.clientHeight +
      optionsContainerElement.scrollTop -
      optionElement.offsetHeight;

    // Measured the option position with the option height
    // changed the scroll top if the option reached the end of the options container height
    if (optionPosition >= optionsContainerPosition) {
      optionsContainerElement.scrollTop += optionElement.offsetHeight;
    }
  }
};

export const moveScrollToTop = (optionsContainerRef, optionRef, isFirstOption) => {
  const optionsContainerElement = optionsContainerRef.current;
  const optionElement = optionRef.current;

  if (isFirstOption) {
    if (optionsContainerElement) {
      optionsContainerElement.scrollTop = optionsContainerElement.scrollHeight;
    }
  } else if (optionElement && optionsContainerElement) {
    const optionPosition = optionElement.offsetTop - optionElement.offsetHeight;
    if (optionPosition <= optionsContainerElement.scrollTop) {
      optionsContainerElement.scrollTop -= optionElement.offsetHeight;
    }
  }
};

export const getNotEditableSearchOptionLeftSide = (selectionStartNumber, curValue, booleanOperators) => {
  const leftValue = curValue.slice(0, selectionStartNumber);

  for (let i = selectionStartNumber - 1; i > 0; i--) {
    const char = leftValue[i];

    if (char === SPACE) {
      const { label: boolOperBefore } = findBoolOperator(booleanOperators, curValue, i, BEFORE);
      if (boolOperBefore) {
        return curValue.slice(0, i + 1);
      }
    }
  }

  return '';
};

export const getNotEditableSearchOptionRightSide = (selectionStartNumber, curValue, operators) => {
  for (let i = selectionStartNumber; i < curValue.length; i++) {
    const char = curValue[i];
    const operatorWithSpaceAfter = curValue.slice(i, i + 3);
    const isOperatorAfter = operators.some(oper => oper.label === operatorWithSpaceAfter.trim());

    if (char === SPACE && isOperatorAfter) {
      return curValue.slice(i);
    }
  }

  return '';
};

export const getNotEditableValueBefore = (
  selectionStartNumber,
  curValue,
  operators,
  booleanOperators,
  typedValueForEditMode,
) => {
  const leftValue = curValue.slice(0, selectionStartNumber);

  for (let i = selectionStartNumber - 1; i > 0; i--) {
    const char = leftValue[i];
    const charAfter = leftValue[i + 1];

    if (char === CLOSE_BRACKET && charAfter === SPACE) {
      return curValue.slice(0, i + 1);
    }

    if (char === SPACE) {
      const operatorWithSpaceBefore = leftValue.slice(i - 2, i);
      const isOperatorBefore = operators.some(oper => oper.label === operatorWithSpaceBefore.trim());
      const { label: boolOperatorBefore } = findBoolOperator(booleanOperators, curValue, i, BEFORE);
      const { label: boolOperatorAfter } = findBoolOperator(booleanOperators, curValue, i, AFTER);

      if (
        boolOperatorBefore ||
        boolOperatorAfter ||
        isOperatorBefore
      ) {
        return curValue.slice(0, i + 1);
      }
    }

    const { label: boolOpAfter } = findBoolOperator(booleanOperators, curValue, i + 1, AFTER);
    const { label: boolOpBefore } = findBoolOperator(booleanOperators, curValue, i + 1, BEFORE);

    if (
      (boolOpAfter && !typedValueForEditMode) ||
      boolOpBefore
    ) {
      return curValue.slice(0, i + 1);
    }
  }

  return '';
};

export const getNotEditableValueAfter = (selectionStartNumber, curValue, booleanOperators) => {
  for (let i = selectionStartNumber; i < curValue.length; i++) {
    const char = curValue[i];

    if (char === SPACE) {
      const isLineEndAfter = !curValue[i + 1];
      const { label: boolOperatBefore } = findBoolOperator(booleanOperators, curValue, i, BEFORE);
      const { label: boolOperatAfter } = findBoolOperator(booleanOperators, curValue, i, AFTER);

      if (boolOperatBefore || boolOperatAfter) return curValue.slice(i);
      if (isLineEndAfter) return '';
    }

    const { label: boolOpertAfter } = findBoolOperator(booleanOperators, curValue, i - 1, AFTER);
    const { label: boolOpertBefore } = findBoolOperator(booleanOperators, curValue, i - 1, BEFORE);

    if (boolOpertAfter || boolOpertBefore) return curValue.slice(i);
  }

  return '';
};

export const getSearchWords = (
  isTypedValueNotBracket,
  typedValue,
  typedValueWithoutOpenBracket,
) => {
  const isValidSearchWords =
    isTypedValueNotBracket
    && typedValue !== SPACE
    && typedValueWithoutOpenBracket;
  return isValidSearchWords
    ? [typedValueWithoutOpenBracket.trim()]
    : [];
};

export const changeTextAreaHeight = (textareaRef) => {
  textareaRef.current.focus();
  textareaRef.current.style.height = 0;
  const scrollHeight = textareaRef.current.scrollHeight;
  textareaRef.current.style.height = `${scrollHeight}px`;
};
