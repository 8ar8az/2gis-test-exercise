import React, {
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import _ from 'lodash/fp';

import styles from './books-widget.scss';
import { CategoriesSelector, useCurrentCategory } from './categories-navigation';
import {
  BooksList,
  booksReducer,
  initialBooksState,
  fetchBooks,
  loadingStates,
  Book,
  toggleBookCategory,
  saveByCategory,
  getFilteredItemsIds,
  getCategoriesCount,
} from './books-list';
import { Filter, useFilteredTags } from './tags-filtering';

const BooksWidget = () => {
  const [booksState, dispatch] = useReducer(booksReducer, initialBooksState);
  const {
    loadingState,
    byId,
    byCategory,
  } = booksState;

  const currentCategory = useCurrentCategory();
  const filteredTags = useFilteredTags();

  const filteredBookIds = useMemo(
    () => getFilteredItemsIds({
      byId,
      byCategory,
      currentCategory,
      filteredTags,
    }),
    [byId, byCategory, currentCategory, filteredTags],
  );

  const categoriesCounts = useMemo(
    () => getCategoriesCount(byCategory),
    [byCategory],
  );

  useEffect(
    () => {
      fetchBooks(dispatch, loadingState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => {
      saveByCategory(byCategory, loadingState);
    },
    [byCategory, loadingState],
  );

  const handleBookCategoryToggle = useCallback(
    (id, category) => dispatch(toggleBookCategory(id, category)),
    [],
  );

  const handleRetryButtonClick = () => fetchBooks(dispatch, loadingState);

  const renderListPlaceholder = (content) => (
    <p className={styles.listPlaceholder}>
      {content}
    </p>
  );

  const renderBook = useCallback(
    ({ id, ref, style }) => (
      <Book
        ref={ref}
        item={byId[id]}
        category={currentCategory}
        onCategoryToggle={handleBookCategoryToggle}
        style={style}
      />
    ),
    [byId, currentCategory, handleBookCategoryToggle],
  );

  const contentRendersByLoadingState = [
    {
      check: () => [loadingStates.none, loadingStates.loading].includes(loadingState),
      render: () => renderListPlaceholder(
        <span className={styles.loadingLabel}>
          Loading
        </span>,
      ),
    },
    {
      check: () => (loadingState === loadingStates.failure),
      render: () => renderListPlaceholder(
        <div>
          An error occurred while loading data
          <br />
          <button
            type="button"
            className={styles.retryButton}
            onClick={handleRetryButtonClick}
          >
            Retry
          </button>
        </div>,
      ),
    },
    {
      check: () => _.isEmpty(filteredBookIds),
      render: () => renderListPlaceholder('List is empty'),
    },
    {
      check: _.stubTrue,
      render: () => <BooksList ids={filteredBookIds} renderBook={renderBook} />,
    },
  ];

  return (
    <div className={styles.root}>
      <CategoriesSelector counts={categoriesCounts} />
      <Filter />
      {contentRendersByLoadingState.find(({ check }) => check()).render()}
    </div>
  );
};

export default BooksWidget;
