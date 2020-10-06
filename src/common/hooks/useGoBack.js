import {
  useCallback,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

const useGoBack = (defaultPath) => {
  const history = useHistory();
  const location = useLocation();

  const goBack = useCallback(() => {
    if (location.state?.hasPrevious) {
      history.goBack();
    } else {
      history.push({
        pathname: defaultPath,
        search: location.search,
      });
    }
  }, [defaultPath, location.state?.hasPrevious, location.search]);

  return goBack;
};

export default useGoBack;
