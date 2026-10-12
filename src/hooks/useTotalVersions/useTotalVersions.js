import {
  useEffect,
  useState,
} from 'react';

const useTotalVersions = totalRecords => {
  const [totalVersions, setTotalVersions] = useState(0);

  useEffect(() => {
    if (totalRecords) {
      setTotalVersions(totalRecords);
    }
  }, [totalRecords]);

  return [totalVersions, setTotalVersions];
};

export default useTotalVersions;
