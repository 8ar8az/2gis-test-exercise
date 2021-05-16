import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash/fp';

import styles from './tags-list.scss';
import useFilteredTags from './useFilteredTags';
import tagsSearchParamName from './searchParamName';

const TagsList = ({ tags }) => {
  const filteredTags = useFilteredTags();

  const getTagLinkLocation = (tag) => (location) => {
    const isFiltered = filteredTags.has(tag);
    const newFilteredTags = new Set(filteredTags);

    if (isFiltered) {
      newFilteredTags.delete(tag);
    } else {
      newFilteredTags.add(tag);
    }

    const searchParams = new URLSearchParams(location.search);

    if (!newFilteredTags.size) {
      searchParams.delete(tagsSearchParamName);
    } else {
      searchParams.set(tagsSearchParamName, [...newFilteredTags].join(','));
    }

    return { ...location, search: searchParams.toString() };
  };

  const renderedTags = _.flow(
    _.uniq,
    _.map((tag) => (
      <li key={tag} className={styles.tagItem}>
        <Link to={getTagLinkLocation(tag)} className={styles.tagLink}>
          {tag}
        </Link>
      </li>
    )),
  )(tags);

  return (
    <ul className={styles.root}>
      {renderedTags}
    </ul>
  );
};

TagsList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsList;
