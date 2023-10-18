import {
  useEffect,
  useState,
} from 'react';
import {
  cloneDeep,
  get,
  set,
} from 'lodash';

import { useNamespace } from '@folio/stripes/core';

import {
  getItem,
  setItem,
} from '../../storage';

const useHoldingsAccordionState = ({ instanceId, pathToAccordion = [] }) => {
  const [namespace] = useNamespace();
  const key = `${namespace}.instanceHoldingsAccordionsState`;

  const instanceHoldingsAccordionsState = getItem(key) ?? {};
  const currentAccState = get(instanceHoldingsAccordionsState, [instanceId, ...pathToAccordion], false);

  const [isOpen, setIsOpen] = useState(currentAccState);

  useEffect(() => {
    let newState = {
      [instanceId]: {
        ...cloneDeep(instanceHoldingsAccordionsState[instanceId]),
      }
    };

    newState = set(newState, [instanceId, ...pathToAccordion], isOpen);

    setItem(key, newState);
  }, [instanceHoldingsAccordionsState, isOpen, instanceId]);

  return [isOpen, setIsOpen];
};

export default useHoldingsAccordionState;
