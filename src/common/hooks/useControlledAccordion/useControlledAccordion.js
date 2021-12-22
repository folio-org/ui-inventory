import { useCallback, useEffect, useState } from 'react';

const useControlledAccordion = (initialState = false) => {
  const [open, setOpen] = useState(initialState);

  useEffect(() => {
    setOpen(initialState);
  }, [initialState]);

  const onToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return {
    open,
    onToggle,
  };
};

export default useControlledAccordion;
