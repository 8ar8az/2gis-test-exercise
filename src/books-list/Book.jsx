import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';

import styles from './book.scss';
import { TagsList } from '../tags-filtering';
import { categories } from '../categories-navigation';

const buttonConfigByCategory = {
  [categories.toread]: { label: 'start reading', icon: '→' },
  [categories.inprogress]: { label: 'finish reading', icon: '→' },
  [categories.done]: { label: 'return in «to read»', icon: '↲' },
};

const Book = React.forwardRef(({
  item,
  category,
  onCategoryToggle,
  style,
}, ref) => {
  const {
    id,
    author,
    description,
    title,
    tags,
  } = item;

  const { label, icon } = buttonConfigByCategory[category];

  const handleToggleClick = () => onCategoryToggle(id, category);

  return (
    <article className={styles.root} style={style} ref={ref}>
      <header className={styles.header}>
        <address className={styles.author}>
          {author}
        </address>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggleClick}
        >
          <span className={styles.toggleButtonLabel}>{label}</span>
          &nbsp;
          {icon}
        </button>
      </header>
      <p className={styles.description}>{description}</p>
      {(!!tags && !_.isEmpty(tags)) && (
        <aside className={styles.tags}>
          <TagsList tags={item.tags} />
        </aside>
      )}
    </article>
  );
});

const bookPropType = PropTypes.exact({
  id: PropTypes.string,
  author: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
});

Book.propTypes = {
  item: bookPropType.isRequired,
  category: PropTypes.oneOf(_.values(categories)).isRequired,
  onCategoryToggle: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

Book.defaultProps = {
  style: {},
};

export default Book;
