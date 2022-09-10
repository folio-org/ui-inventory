import { useRef, useEffect } from 'react';

// A hook which holds a previous value.
// Useful to hold props from a previous render.
const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
