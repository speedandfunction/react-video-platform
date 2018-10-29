import {createReducer} from '../utils';
import {
  SET_SETTINGS,
  SET_STATIC,
  SET_CATEGORIES,
  SET_INTROS,
  SET_FAVOTIRES_VIDEOS,
  SET_MAGICIANS,
  CLEAR_SETTINGS,
} from '../constants/actionTypes';

const initialState = {
  homepage_video: {
    video: '',
    images: [],
  },
  stripe_publishable_key: '',

  staticData: null,
  isMobile: false,
  categories: null,
  intros: null,
  magicians: null,
};

function updateVideoWishListStatus(categories, params) {
  return categories.map((subcategory) => {
    const _videos = subcategory.videos.map((video) => {
      const videoId = video.id || video.v_id;
      let {in_user_wishlist = false} = video;

      if (videoId === params.id) {
        in_user_wishlist = !in_user_wishlist;
      }

      return {
        ...video,
        in_user_wishlist,
      };
    });

    return {
      ...subcategory,
      videos: _videos,
    };
  });
}

function getCurrentVideo(categories, params) {
  let video = null;

  categories.forEach((subs) => {
    const items = [].concat(subs.subcategories, subs.predefined);

    items.forEach((item) => {
      item.videos.forEach((videoItem) => {
        const videoId = videoItem.id || videoItem.v_id;

        if (videoId === params.id) {
          video = videoItem;
        }
      });
    });
  });

  return video;
}

const settingsReducer = createReducer(initialState, {
  [CLEAR_SETTINGS]: state => ({
    ...state,
    categories: null,
  }),

  [SET_SETTINGS]: (state, {settings}) => ({
    ...state, ...settings,
  }),

  [SET_STATIC]: (state, {staticData}) => (
    {...state, staticData}
  ),

  [SET_CATEGORIES]: (state, {categories}) => (
    {...state, categories}
  ),

  [SET_MAGICIANS]: (state, {magicians}) => (
    {...state, magicians}
  ),

  [SET_INTROS]: (state, {intros}) => (
    {...state, intros}
  ),

  [SET_FAVOTIRES_VIDEOS]: (state, {params}) => {
    const categories = state.categories.map((category) => {
      const subcategories = updateVideoWishListStatus(category.subcategories, params);
      const predefined = updateVideoWishListStatus(category.predefined, params);

      return {
        ...category,
        subcategories,
        predefined,
      };
    });

    const video = getCurrentVideo(categories, params);

    const categoriesWithFavorite = categories.map((subcategory) => {
      if (subcategory.id === params.parentId) {
        const predefined = subcategory.predefined.map((item) => {
          if (item.name === 'My Favorite') {
            /* Add video to Favorites list */
            if (params.status === 'add') {
              item.videos.unshift({...video});
            /* Remove video from Favorites list */
            } else {
              let videoIndex;

              item.videos.forEach((videoItem, index) => {
                if (videoItem.v_id === params.id) {
                  videoIndex = index;
                }
              });
              item.videos.splice(videoIndex, 1);
            }
          }

          return item;
        });

        return {
          ...subcategory,
          predefined,
          subcategories: subcategory.subcategories,
        };
      }

      return subcategory;
    });

    return {
      ...state,
      categories: categoriesWithFavorite,
    };
  },
});

export default settingsReducer;
