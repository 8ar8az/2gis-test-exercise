import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import tagsSearchParamName from './searchParamName';

type FilteredTags = Set<string>;

export default (): FilteredTags => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagsString = searchParams.get(tagsSearchParamName);

  const tagsFilter = useMemo<FilteredTags>(
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
