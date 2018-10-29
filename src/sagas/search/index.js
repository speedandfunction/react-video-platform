import {put, call, takeLatest} from 'redux-saga/effects';
import {store} from '../../store';

import {
  ON_MESSAGE,
  GET_VIDEOS,
  SET_SEARCHED_VIDEOS,
} from '../../constants/actionTypes';
import Api from '../../utils/api';

function searchVideosApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id}},
  } = state;
  const {value} = params;

  return Api.get('/public-api/videos', {
    id,
    token,
    search: value,
    page: 1,
    size: 10,
  });
}

function* onError(error) {
  yield put({
    type: ON_MESSAGE,
    message: error,
    messageType: 'error'
  });
}

function* searchVideos(action) {
  try {
    const {params} = action;
    const videos = yield call(searchVideosApi, params);

    if (videos.data.length) {
      yield put({type: SET_SEARCHED_VIDEOS, videos});
    }
  } catch (error) {
    yield onError(error);
  }
}

export function* searchVideosWatcher() {
  yield takeLatest(GET_VIDEOS, searchVideos);
}
