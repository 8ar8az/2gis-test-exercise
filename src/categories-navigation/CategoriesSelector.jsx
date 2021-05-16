import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import { NavLink } from 'react-router-dom';
import useCurrentCategory from './useCurrentCategory';

import { categories, categorySearchParamName } from './constants';
import styles from './сategories.scss';

const categoriesTitles = {
  [categories.inprogress]: 'In progress',
  [categories.toread]: 'To read',
  [categories.done]: 'Done',
};

const CategoriesSelector = ({ counts }) => {
  const currentCategory = useCurrentCategory();

  const getCategoryLocation = (category) => (location) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(categorySearchParamName, category);

    return { ...location, search: searchParams.toString() };
  };

  const isActiveCategory = (category) => () => (category === currentCategory);

  const renderCategory = (category) => (
    <li
      key={category}
      className={styles.categoryItem}
    >
      <NavLink
        to={getCategoryLocation(category)}
        className={styles.categoryLink}
        activeClassName={styles.categoryLinkCurrent}
        isActive={isActiveCategory(category)}
      >
        {`${categoriesTitles[category]} (${counts[category] || 0})`}
      </NavLink>
    </li>
  );

  return (
    <ul className={styles.root}>
      {[
        categories.toread,
        categories.inprogress,
        categories.done,
      ].map(renderCategory)}
    </ul>
  );
};

CategoriesSelector.propTypes = {
  counts: PropTypes.exact(
    _.mapValues(_.constant(PropTypes.number), categories),
  ).isRequired,
};

export default CategoriesSelector;
