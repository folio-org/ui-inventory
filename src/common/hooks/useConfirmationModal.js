import { useState } from 'react';

export const useConfirmationModal = props => {
  const [open, setOpen] = useState(false);
  const [callbacks, setCallbacks] = useState();

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
