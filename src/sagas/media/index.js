import {put, call, takeLatest} from 'redux-saga/effects';
import {store} from '../../store';

import {
  ON_MESSAGE,
  GET_TUTORIALS_INTRO,
  SET_TUTORIALS_INTRO,
  GET_CARD_VIDEO,
  SET_CARD_VIDEO,
  GET_MAGICIAN_TUTORIALS,
  SET_MAGICIAN_VIDEOS,
  GET_MAGICIAN_VIDEOS,
  SET_MAGICIAN_CATEGORIES_VIDEOS,
  GET_VIDEO_REVIEWS,
  SET_VIDEO_REVIEWS,
  SET_VIDEO_REVIEW,
  CREATE_VIDEO_REVIEW,
  GET_PAGE_VIDEO,
  SET_PAGE_VIDEO,
} from '../../constants/actionTypes';
import Api from '../../utils/api';

function getVideoReviewsApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id, sub_profile_id}},
  } = state;

  return Api.get(`/public-api/videos/${params.id}/reviews`, {
    id,
    sub_profile_id,
    token
  });
}

function createVideoReviewApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id, sub_profile_id}},
  } = state;

  return Api.post(`/public-api/videos/${params.id}/reviews`, {
    id,
    sub_profile_id,
    token,
    comment: params.text,
    rating: params.rating,
  });
}

function getVideoApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id}},
  } = state;

  return Api.get(`/public-api/videos/${params.id}`, {id, token});
}

function getSeriesApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id}},
  } = state;

  return Api.get(`/public-api/series/${params.id}`, {id, token});
}

function getMagicianCategoryVideosApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id}},
  } = state;
  const magicianId = params.id || params.mid;

  return Api.get('/public-api/videos', {
    id,
    token,
    magician: magicianId,
    category: params.category,
  });
}

function* onError(error) {
  yield put({
    type: ON_MESSAGE,
    message: error,
    messageType: 'error'
  });
}

function* getTutorialsIntro(action) {
  try {
    const {params} = action;
    const {video} = yield call(getVideoApi, params);

    if (video) {
      yield put({type: SET_TUTORIALS_INTRO, video});
    }
  } catch (error) {
    yield onError(error);
  }
}

function* getCardVideo(action) {
  try {
    const {params} = action;
    const video = yield call(getVideoApi, params);

    if (video) {
      yield put({type: SET_CARD_VIDEO, video});
    }
  } catch (error) {
    yield onError(error);
  }
}

function* getMagicianTutorials(action) {
  try {
    const {params} = action;
    const videos = yield call(
      getMagicianCategoryVideosApi,
      {...params, category: 45}
    );

    yield put({type: SET_MAGICIAN_VIDEOS, videos});
  } catch (error) {
    yield onError(error);
  }
}

/* Get tutorials and performance videos */
function* getMagicianCategoriesVideos(action) {
  try {
    const {params} = action;
    const tutorials = yield call(
      getMagicianCategoryVideosApi,
      {...params, category: 45}
    );
    const performance = yield call(
      getMagicianCategoryVideosApi,
      {...params, category: 44}
    );

    yield put({
      type: SET_MAGICIAN_CATEGORIES_VIDEOS,
      tutorials,
      performance,
    });
  } catch (error) {
    yield onError(error);
  }
}

function* getVideoReviews(action) {
  try {
    const {params} = action;
    const reviews = yield call(getVideoReviewsApi, params);

    yield put({type: SET_VIDEO_REVIEWS, reviews});
  } catch (error) {
    yield onError(error);
  }
}

function* createVideoReview(action) {
  try {
    const {params} = action;
    const review = yield call(createVideoReviewApi, params);

    yield put({type: SET_VIDEO_REVIEW, review});
  } catch (error) {
    yield onError(error);
  }
}

function* getPageVideo(action) {
  try {
    const {params} = action;
    const video = yield call(getVideoApi, params);
    let series;

    if (video.series_id) {
      series = yield call(getSeriesApi, {id: video.series_id});
    }

    yield put({
      type: SET_PAGE_VIDEO,
      video: {...video, series}
    });
  } catch (error) {
    yield onError(error);
  }
}

export function* getTutorialsIntroWatcher() {
  yield takeLatest(GET_TUTORIALS_INTRO, getTutorialsIntro);
}

export function* getCardVideoWatcher() {
  yield takeLatest(GET_CARD_VIDEO, getCardVideo);
}

export function* getMagicianTutorialsWatcher() {
  yield takeLatest(GET_MAGICIAN_TUTORIALS, getMagicianTutorials);
}

export function* getMagicianCategoriesVideosWatcher() {
  yield takeLatest(GET_MAGICIAN_VIDEOS, getMagicianCategoriesVideos);
}
export function* getVideoReviewsWatcher() {
  yield takeLatest(GET_VIDEO_REVIEWS, getVideoReviews);
}

export function* createVideoReviewWatcher() {
  yield takeLatest(CREATE_VIDEO_REVIEW, createVideoReview);
}

export function* getPageVideoWatcher() {
  yield takeLatest(GET_PAGE_VIDEO, getPageVideo);
}
