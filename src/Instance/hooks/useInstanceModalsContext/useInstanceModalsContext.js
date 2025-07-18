import { useContext } from 'react';

import { InstanceModalsContext } from '../../../contexts';

const useInstanceModalsContext = () => {
  return useContext(InstanceModalsContext);
};

export default useInstanceModalsContext;
