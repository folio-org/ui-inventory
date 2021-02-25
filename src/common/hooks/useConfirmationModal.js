import { useState } from 'react';
import { noop } from 'lodash';


export const useConfirmationModal = props => {
  const [open, setOpen] = useState(false);
  const [callbacks, setCallbacks] = useState({
    resolve: noop,
    reject: noop,
  });

  const wait = () => {
    setOpen(true);
    return new Promise((resolve, reject) => setCallbacks({ resolve, reject }));
  };

  const onCancel = () => {
    setOpen(false);
    callbacks.reject();
  };

  const onConfirm = () => {
    setOpen(false);
    callbacks.resolve();
  };

  return {
    wait,
    props: {
      open,
      onCancel,
      onConfirm,
      ...props,
    }
  };
};

export default useConfirmationModal;
