import { useContext } from 'react';

import { DataContext } from '../contexts';

const useReferenceData = () => useContext(DataContext);

export default useReferenceData;
