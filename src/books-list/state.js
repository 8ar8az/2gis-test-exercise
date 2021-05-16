import _ from 'lodash/fp';
import axios from 'axios';

import createReducer from '../utils/createReducer';
import { loadingStates, dataUrl, booksByCategoryLocalStorageKey } from './constants';
import { categories } from '../categories-navigation';
import isSubset from '../utils/isSubset';

const BOOKS_FETCHING_REQUEST = 'BOOKS_DATA_REQUEST';
const BOOKS_FETCHING_SUCCESS = 'BOOKS_FETCHING_SUCCESS';
const BOOKS_FETCHING_FAILURE = 'BOOKS_FETCHING_FAILURE';

const BOOK_CATEGORY_TOGGLE = 'BOOK_CATEGORY_TOGGLE';

export const fetchBooks = async (dispatch, loadingState) => {
  if (loadingState === loadingStates.success) {
    return;
  }

  dispatch({ type: BOOKS_FETCHING_REQUEST });

  try {
    const { data: { items } } = await axios.get(dataUrl);
    const savedByCategory = JSON.parse(localStorage.getItem(booksByCategoryLocalStorageKey) || '{}');

    dispatch({
      type: BOOKS_FETCHING_SUCCESS,
      payload: { items, savedByCategory },
    });
  } catch (e) {
    dispatch({ type: BOOKS_FETCHING_FAILURE });
  }
};

export const toggleBookCategory = (bookId, currentCategory) => ({
  type: BOOK_CATEGORY_TOGGLE,
  payload: { bookId, currentCategory },
});

export const saveByCategory = (byCategory, loadingState) => {
  if (loadingState !== loadingStates.success) {
    return;
  }

  const categoriesForSave = _.omit(categories.toread, byCategory);

  localStorage.setItem(booksByCategoryLocalStorageKey, JSON.stringify(categoriesForSave));
};

export const getFilteredItemsIds = ({
  byId,
  currentCategory,
  byCategory,
  filteredTags,
}) => {
  const categoryIds = byCategory[currentCategory];

  if (!filteredTags.size) {
    return categoryIds;
  }

  return categoryIds.filter((id) => {
    const itemTags = new Set(byId[id].tags || []);

    return isSubset(filteredTags, itemTags);
  });
};

export const getCategoriesCount = (byCategory) => _.mapValues(
  (categoryIds) => categoryIds.length,
  byCategory,
);

export const initialBooksState = {
  loadingState: loadingStates.none,
  byId: {},
  byCategory: _.mapValues(() => [], categories),
};

export const booksReducer = createReducer({
  [BOOKS_FETCHING_REQUEST]: (state) => ({ ...state, loadingState: loadingStates.loading }),
  [BOOKS_FETCHING_FAILURE]: (state) => ({ ...state, loadingState: loadingStates.failure }),
  [BOOKS_FETCHING_SUCCESS]: (state, { payload: { items, savedByCategory } }) => {
    const savedCategories = _.keys(savedByCategory);

    const savedByCategorySets = _.mapValues(
      (categoryIds) => new Set(categoryIds),
      savedByCategory,
    );

    const ids = _.map('id', items);
    const byCategory = _.groupBy(
      (id) => savedCategories
        .find((category) => savedByCategorySets[category].has(id)) || categories.toread,
      ids,
    );
    const byId = _.keyBy('id', items);

    return {
      byId,
      byCategory: { ...state.byCategory, ...byCategory },
      loadingState: loadingStates.success,
    };
  },
  [BOOK_CATEGORY_TOGGLE]: (state, { payload: { bookId, currentCategory } }) => {
    const categoryTransitions = {
      [categories.toread]: categories.inprogress,
      [categories.inprogress]: categories.done,
      [categories.done]: categories.toread,
    };

    const { byCategory } = state;

    const newCategory = categoryTransitions[currentCategory];

    const currentCategoryIds = byCategory[currentCategory];
    const nextCategoryIds = byCategory[newCategory];

    const updatedByCategory = {
      ...byCategory,
      [currentCategory]: currentCategoryIds.filter((id) => id !== bookId),
      [newCategory]: [...nextCategoryIds, bookId],
    };

    return { ...state, byCategory: updatedByCategory };
  },
});
