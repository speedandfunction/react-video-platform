import {createReducer} from '../utils';
import {
  SET_SEARCHED_VIDEOS,
  CLEAR_SEARCH
} from '../constants/actionTypes';

const initialState = {
  videos: {
    data: [],
  },
};

const searchReducer = createReducer(initialState, {
  [SET_SEARCHED_VIDEOS]: (state, {videos}) => (
    {
      ...state,
      videos,
    }
  ),

  [CLEAR_SEARCH]: () => (
    {...initialState}
  ),
});

export default searchReducer;
