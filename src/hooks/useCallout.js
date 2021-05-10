import { useContext } from 'react';
import { CalloutContext } from '@folio/stripes/core';

const useCallout = () => {
  return useContext(CalloutContext);
};

export default useCallout;
