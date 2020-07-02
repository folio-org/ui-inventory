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
    if (history.action === 'PUSH') {
      history.goBack();
    } else {
      history.push({
        pathname: defaultPath,
        search: location.search,
      });
    }
  }, [defaultPath, history.action, location.search]);

  return goBack;
};

export default useGoBack;
