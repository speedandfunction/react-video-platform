import {put, call, takeLatest, takeEvery} from 'redux-saga/effects';
import {store} from '../../store';
import {forwardTo} from '../../utils';

import {
  ON_MESSAGE, TRACK_VIDEO, AUTH_LOGOUT,
  ADD_TO_WISHLIST, SET_FAVOTIRES_VIDEOS, REMOVE_FROM_WISHLIST,
  GET_ACTIVE_PROFILE, SET_ACTIVE_PROFILE,
  LIKE_VIDEO, SET_CARD_LIKES, DISLIKE_VIDEO,
  PROFILE_UPDATE, GET_SUB_PROFILE, PROFILE_DELETE,
  ACCOUNT_UPDATE, AUTH_INFO_SET, PASSWORD_UPDATE,
  ACCOUNT_DELETE,
} from '../../constants/actionTypes';
import Api from '../../utils/api';

function addToWishListApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id, sub_profile_id}},
  } = state;

  return Api.post(`/public-api/videos/wishlist/${params.id}`, {
    id,
    token,
    sub_profile_id,
  });
}

function removeFromWishListApi(params) {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id, sub_profile_id}},
  } = state;

  return Api.delete(`/public-api/videos/wishlist/${params.id}`, {
    id,
    token,
    sub_profile_id,
  });
}

function getFavoritesApi() {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.get('/public-api/videos/wishlist', {
    id: user.id,
    token,
    sort: 'recent'
  });
}

function getActiveProfileApi() {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/active-profiles', {
    id: user.id,
    token,
  });
}

function getSubProfileApi() {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/view-sub-profile', {
    id: user.id,
    sub_profile_id: user.sub_profile_id,
    token,
  });
}

function likeVideoApi(params) {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/like_video', {
    id: user.id,
    admin_video_id: params.id,
    sub_profile_id: user.sub_profile_id,
    token,
  });
}

function disLikeVideoApi(params) {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/dis_like_video', {
    id: user.id,
    admin_video_id: params.id,
    sub_profile_id: user.sub_profile_id,
    token,
  });
}

function updateProfileApi(params) {
  return Api.postFormData('/userApi/edit-sub-profile', params);
}

function accountUpdateApi(params) {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/updateProfile', {
    ...params,
    id: user.id,
    token,
  });
}

function passwordUpdateApi(params) {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/changePassword', {
    ...params,
    id: user.id,
    token,
    old_password: params.password,
    password: params.newPassword,
    password_confirmation: params.confirmPassword,
  });
}

function deleteAccountApi(params) {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/deleteAccount', {
    ...params,
    id: user.id,
    token,
    password: params.password,
  });
}

function deleteProfileApi() {
  const state = store.getState();
  const {auth: {info: {token}, user}} = state;

  return Api.post('/userApi/delete-sub-profile', {
    id: user.id,
    sub_profile_id: user.sub_profile_id,
    token,
  });
}

function trackVideoApi({hash, time}) {
  const splited = API_URL.split('.');

  splited.shift();

  const URL = `https://${splited.join('.')}`;

  return Api.post(`${URL}/tracker?hash=${hash}&s=${time}`);
}

function* onError(error) {
  yield put({
    type: ON_MESSAGE,
    message: error,
    messageType: 'error'
  });
}

function* addToWishList(action) {
  try {
    const {params} = action;
    const res = yield call(addToWishListApi, params);

    if (res.success) {
      const videos = yield call(getFavoritesApi);

      yield put({
        type: SET_FAVOTIRES_VIDEOS,
        videos,
        params: {...params, status: 'add'},
      });
    }
  } catch (error) {
    yield onError(error);
  }
}

function* removeFromWishList(action) {
  try {
    const {params} = action;
    const res = yield call(removeFromWishListApi, params);

    if (res.success) {
      const videos = yield call(getFavoritesApi);

      yield put({
        type: SET_FAVOTIRES_VIDEOS,
        videos,
        params: {...params, status: 'remove'},
      });
    }
  } catch (error) {
    yield onError(error);
  }
}

function* trackVideo(action) {
  try {
    const {params} = action;
    yield call(trackVideoApi, params);
  } catch (error) {
    yield onError(error);
  }
}

function* getActiveProfile(action) {
  try {
    const {params} = action;
    const {data} = yield call(getActiveProfileApi, params);

    yield put({type: SET_ACTIVE_PROFILE, profile: data});
  } catch (error) {
    yield onError(error);
  }
}

function* getSubProfile(action) {
  try {
    const {params} = action;
    yield call(getSubProfileApi, params);
  } catch (error) {
    yield onError(error);
  }
}

function* likeVideo(action) {
  try {
    const {params} = action;
    const {dislike_count, like_count} = yield call(likeVideoApi, params);

    yield put({type: SET_CARD_LIKES, dislike_count, like_count});
  } catch (error) {
    yield onError(error);
  }
}

function* disLikeVideo(action) {
  try {
    const {params} = action;
    const {dislike_count, like_count} = yield call(disLikeVideoApi, params);

    yield put({type: SET_CARD_LIKES, dislike_count, like_count});
  } catch (error) {
    yield onError(error);
  }
}

function* updateProfile(action) {
  try {
    const {params} = action;

    yield call(updateProfileApi, params);

    yield put({
      type: ON_MESSAGE,
      message: 'Profile was updated',
      messageType: 'success',
    });
  } catch (error) {
    yield onError(error);
  }
}

function* deleteProfile(action) {
  try {
    const {params} = action;
    const res = yield call(deleteProfileApi, params);

    if (!res.success) {
      yield onError(new Error(res.error_messages));
    } else {
      forwardTo('/manage-profiles');
    }
  } catch (error) {
    yield onError(error);
  }
}

function* accountUpdate(action) {
  try {
    const {params} = action;
    const user = yield call(accountUpdateApi, params);

    if (!user.success) {
      yield onError(new Error(user.error_messages));
    } else {
      yield put({type: AUTH_INFO_SET, user});
      forwardTo('/account-settings');
      yield put({
        type: ON_MESSAGE,
        message: 'Your account has been successfully updated',
        messageType: 'success',
      });
    }
  } catch (error) {
    yield onError(error);
  }
}

function* passwordUpdate(action) {
  try {
    const {params} = action;
    const res = yield call(passwordUpdateApi, params);

    if (res.success) {
      yield put({type: AUTH_LOGOUT});
      yield put({
        type: ON_MESSAGE,
        message: 'Password Changed successfully.Please login and continue your account details.',
        messageType: 'success',
      });
    }
  } catch (error) {
    yield onError(error);
  }
}

function* deleteAccount(action) {
  try {
    const {params} = action;
    const res = yield call(deleteAccountApi, params);

    if (res.success) {
      yield put({type: AUTH_LOGOUT});
      yield put({
        type: ON_MESSAGE,
        message: res.message,
        messageType: 'success',
      });
    } else {
      yield onError(new Error(res.error_messages));
    }
  } catch (error) {
    yield onError(error);
  }
}

export function* addToWishListWatcher() {
  yield takeEvery(ADD_TO_WISHLIST, addToWishList);
}

export function* removeFromWishListWatcher() {
  yield takeEvery(REMOVE_FROM_WISHLIST, removeFromWishList);
}

export function* trackVideoWatcher() {
  yield takeLatest(TRACK_VIDEO, trackVideo);
}

export function* getActiveProfileWatcher() {
  yield takeLatest(GET_ACTIVE_PROFILE, getActiveProfile);
}

export function* likeVideoWatcher() {
  yield takeLatest(LIKE_VIDEO, likeVideo);
}

export function* disLikeVideoWatcher() {
  yield takeLatest(DISLIKE_VIDEO, disLikeVideo);
}

export function* updateProfileWatcher() {
  yield takeLatest(PROFILE_UPDATE, updateProfile);
}

export function* getSubProfileWatcher() {
  yield takeLatest(GET_SUB_PROFILE, getSubProfile);
}

export function* deleteProfileWatcher() {
  yield takeLatest(PROFILE_DELETE, deleteProfile);
}

export function* accountUpdateWatcher() {
  yield takeLatest(ACCOUNT_UPDATE, accountUpdate);
}

export function* passwordUpdateWatcher() {
  yield takeLatest(PASSWORD_UPDATE, passwordUpdate);
}

export function* deleteAccountWatcher() {
  yield takeLatest(ACCOUNT_DELETE, deleteAccount);
}
