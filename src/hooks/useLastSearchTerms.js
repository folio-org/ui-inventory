import { useContext } from 'react';
import { LastSearchTermsContext } from '../contexts';

const useLastSearchTerms = () => useContext(LastSearchTermsContext);

export default useLastSearchTerms;
