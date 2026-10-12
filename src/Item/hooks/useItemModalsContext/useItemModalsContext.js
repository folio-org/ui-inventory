import { useContext } from 'react';

import { ItemModalsContext } from '../../../contexts';

const useItemModalsContext = () => {
  return useContext(ItemModalsContext);
};

export default useItemModalsContext;
