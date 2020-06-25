import {
  useState,
  useEffect,
} from 'react';

const useInstance = (id, mutator) => {
  const [instance, setInstance] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    mutator.GET({
      params: {
        query: `id==${id}`,
      },
    })
      .then((instances) => {
        setInstance(instances[0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return {
    instance,
    isLoading,
  };
};

export default useInstance;
