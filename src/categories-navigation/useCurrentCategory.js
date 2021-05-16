import { useLocation } from 'react-router-dom';

import { categories, categorySearchParamName } from './constants';

export default () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  return searchParams.get(categorySearchParamName) || categories.toread;
};
