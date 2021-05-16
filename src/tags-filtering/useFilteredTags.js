import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import tagsSearchParamName from './searchParamName';

export default () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagsString = searchParams.get(tagsSearchParamName);

  const tagsFilter = useMemo(
    () => {
      if (!tagsString) {
        return new Set();
      }

      return new Set(tagsString.split(','));
    },
    [tagsString],
  );

  return tagsFilter;
};
