import React from 'react';
import { Link } from 'react-router-dom';

import TagsList from './TagsList';
import useFilteredTags from './useFilteredTags';
import tagsSearchParamName from './searchParamName';
import styles from './filter.scss';

const Filter = () => {
  const filteredTags = useFilteredTags();

  if (!filteredTags.size) {
    return null;
  }

  const getClearFilteredTagsLocation = (location) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(tagsSearchParamName);

    return { ...location, search: searchParams.toString() };
  };

  return (
    <div className={styles.root}>
      Filtered by tags:
      &nbsp;
      <TagsList tags={[...filteredTags]} />
      <span className={styles.clearLinkWrapper}>
        (
        <Link to={getClearFilteredTagsLocation} className={styles.clearLink}>
          clear
        </Link>
        )
      </span>
    </div>
  );
};

export default Filter;
