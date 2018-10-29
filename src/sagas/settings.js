import {put, call, takeLatest} from 'redux-saga/effects';

import {
  ON_MESSAGE,
  GET_SETTINGS, SET_SETTINGS,
  GET_STATIC_PAGES, SET_STATIC,
  GET_CATEGORIES, SET_CATEGORIES,
  GET_INTROS, SET_INTROS,
  SET_CURRENT_INTRO,
  GET_MAGICIANS, SET_MAGICIANS,
} from '../constants/actionTypes';
import Api from '../utils/api';
import {store} from '../store';

function getSettingsApi(params) {
  const {location: {hostname, port}} = window;
  const isLocalhost = hostname === 'localhost';
  const _port = port && `:${port}`;

  /* In future move to https */
  const url = `https://pub.${hostname}${_port}/json/settings.json`;

  if (isLocalhost) {
    return Api.get('/userApi/site_settings', params);
  }

  return Api.get(url, params);
}

/* F..king BOX BE logic. POST for get request :) */
function getStaticApi() {
  return Api.post('/userApi/allPages');
}

function getCategorisApi() {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id, sub_profile_id}},
  } = state;

  return Api.get('/public-api/categories/tree-videos', {
    token,
    id,
    sub_profile_id
  });
}

function getIntrosApi() {
  const state = store.getState();
  const {auth: {info: {token}, user: {id}}} = state;

  return Api.get('/public-api/intros/10', {token, id});
}

function getMagiciansApi() {
  const state = store.getState();
  const {auth: {info: {token}, user: {id}}} = state;

  return Api.get('/public-api/magicians', {
    token,
    id,
    sort: 'lastname',
    page: 1,
    size: 100,
  });
}

function* onError(error) {
  yield put({
    type: ON_MESSAGE,
    message: error,
    messageType: 'error'
  });
}

function* getSettings(action) {
  try {
    const {params} = action;
    const settings = yield call(getSettingsApi, params);

    // yield put({type: SET_SETTINGS, settings});
    yield put({type: SET_SETTINGS, settings: {
      homepage_video: {}
    }});
  } catch (error) {
    yield onError(error);
  }
}

function* getStatic(action) {
  try {
    const {params} = action;
    const staticData = yield call(getStaticApi, params);

    yield put({
      type: SET_STATIC,
      staticData,
    });
  } catch (error) {
    yield onError(error);
  }
}

function* getCategories() {
  try {
    const data = yield call(getCategorisApi);

    yield put({
      type: SET_CATEGORIES,
      categories: data
    });
  } catch (error) {
    yield onError(error);
  }
}

function* getIntros() {
  try {
    const intros = yield call(getIntrosApi);

    yield put({type: SET_INTROS, intros});
    yield put({
      type: SET_CURRENT_INTRO,
      video: intros.data[0]
    });
  } catch (error) {
    yield onError(error);
  }
}

function* getMagicians() {
  try {
    const magicians = yield call(getMagiciansApi);

    yield put({type: SET_MAGICIANS, magicians});
  } catch (error) {
    yield onError(error);
  }
}

export function* settingsWatcher() {
  yield takeLatest(GET_SETTINGS, getSettings);
}

export function* staticPagesWatcher() {
  yield takeLatest(GET_STATIC_PAGES, getStatic);
}

export function* getCategoriesWatcher() {
  yield takeLatest(GET_CATEGORIES, getCategories);
}

export function* getIntrosWatcher() {
  yield takeLatest(GET_INTROS, getIntros);
}

export function* getMagiciansWatcher() {
  yield takeLatest(GET_MAGICIANS, getMagicians);
}
