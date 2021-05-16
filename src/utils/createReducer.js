import _ from 'lodash/fp';

export default (reducersByActionTypes) => (state, action) => {
  const reducer = reducersByActionTypes[action.type] || _.identity;

  return reducer(state, action);
};
