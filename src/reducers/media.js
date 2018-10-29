import {createReducer} from '../utils';
import {
  SET_TUTORIALS_INTRO,
  CLEAR_TUTORIALS_INTRO,
  SET_CARD_VIDEO,
  CLEAR_CARD_VIDEO,
  SET_MAGICIAN_VIDEOS,
  CLEAR_MAGICIAN_VIDEOS,
  SET_CURRENT_INTRO,
  SET_MAGICIAN_CATEGORIES_VIDEOS,
  SET_CARD_LIKES,
  SET_VIDEO_REVIEWS,
  SET_VIDEO_REVIEW,
  SET_PAGE_VIDEO,
  CLEAR_PAGE_VIDEO,
} from '../constants/actionTypes';

const initialState = {
  currentIntro: null,

  /* Path to Magician intro video */
  tutorialsIntro: null,

  /* Currently running video via VideoCard component */
  cardVideo: null,
  magicianVideos: null,
  categoryVideos: null,
  magicianCategoriesVideos: null,
  cardVideoReviews: null,

  /* Video Page main video */
  pageVideo: null,
};

const mediaReducer = createReducer(initialState, {
  [SET_TUTORIALS_INTRO]: (state, {video}) => ({
    ...state,
    tutorialsIntro: video,
  }),

  [SET_CURRENT_INTRO]: (state, {video}) => (
    {...state, currentIntro: video}
  ),

  [CLEAR_TUTORIALS_INTRO]: state => (
    {...state, tutorialsIntro: null}
  ),

  [SET_CARD_VIDEO]: (state, {video}) => (
    {...state, cardVideo: video}
  ),

  [SET_CARD_LIKES]: (state, {dislike_count, like_count}) => (
    {
      ...state,
      pageVideo: {
        ...state.pageVideo,
        likes_count: like_count,
        dislikes_count: dislike_count,
      }
    }
  ),

  [CLEAR_CARD_VIDEO]: state => (
    {...state, cardVideo: null}
  ),

  [SET_MAGICIAN_VIDEOS]: (state, {videos}) => (
    {...state, magicianVideos: videos}
  ),

  [CLEAR_MAGICIAN_VIDEOS]: state => (
    {...state, magicianVideos: null}
  ),

  [SET_MAGICIAN_CATEGORIES_VIDEOS]: (state, {tutorials, performance}) => ({
    ...state,
    magicianCategoriesVideos: {
      tutorials,
      performance
    }
  }),

  [SET_VIDEO_REVIEWS]: (state, {reviews}) => ({
    ...state,
    cardVideoReviews: reviews,
  }),

  [SET_VIDEO_REVIEW]: (state, {review}) => ({
    ...state,
    cardVideoReviews: {
      ...state.cardVideoReviews,
      data: [
        ...state.cardVideoReviews.data,
        review,
      ]
    },
  }),

  [SET_PAGE_VIDEO]: (state, {video}) => ({
    ...state,
    pageVideo: video,
  }),

  [CLEAR_PAGE_VIDEO]: state => ({
    ...state, pageVideo: null,
  }),

  '@@router/LOCATION_CHANGE': (state, action) => {
    const {payload: {location: {pathname}}} = action;

    /* Reset media state when we move to MAGICIAN page or TUTORIALS page */
    if (/^\/magician\/|^\/magic-tutorials/.test(pathname)) {
      return initialState;
    }

    return state;
  }
});

export default mediaReducer;
