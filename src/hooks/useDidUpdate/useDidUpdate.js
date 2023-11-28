import {
  useEffect,
  useRef,
} from 'react';

const useDidUpdate = (cb, deps) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      cb();
    } else {
      hasMounted.current = true;
    }
  }, deps);
};

export default useDidUpdate;
