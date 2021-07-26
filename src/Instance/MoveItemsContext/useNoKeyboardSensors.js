import { useEffect, useCallback } from 'react';

const useNoKeyboardSensors = (api) => {
  const abortKeyboardSensor = useCallback((e) => {
    if (![' ', 'Spacebar'].includes(e.key)) {
      return;
    }

    const draggableId = api.findClosestDraggableId(e);
    if (!draggableId) {
      return;
    }

    const canLock = api.canGetLock(draggableId);
    if (!canLock) {
      api.tryReleaseLock();
    }

    const preDrag = api.tryGetLock(draggableId);
    if (preDrag !== null) {
      preDrag.abort();
    }
  }, [api]);

  useEffect(() => {
    window.addEventListener('keydown', abortKeyboardSensor);
    return () => window.removeEventListener('keydown', abortKeyboardSensor);
  }, [abortKeyboardSensor]);
};

export default useNoKeyboardSensors;
