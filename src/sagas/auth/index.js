import {put, call, takeLatest} from 'redux-saga/effects';
import {store} from '../../store';

import {
  SIGIN_USER, SIGNUP_USER, SIGNUP_PAYMENT_STEP,
  AUTH_SET_LOADING, AUTH_UNSET_LOADING, SET_AUTHENTICATED,
  AUTH_INFO_SET, SEND_COUPON,
  ON_SUBSCRIBE, ON_MESSAGE,
  GET_COUPON, RESET_PASSWORD, UNSUBSCRIBE,
} from '../../constants/actionTypes';

import {forwardTo} from '../../utils';
import Api from '../../utils/api';

function signInApi(params) {
  return Api.post('/userApi/login', params);
}

function signUpApi(params) {
  const state = store.getState();
  const {
    auth: {info: {promoCode}},
  } = state;

  if (promoCode) {
    params.coupon = promoCode.slug;
  }

  return Api.post('/userApi/register', params);
}

function couponApi(promoCode) {
  return Api.get(`/public-api/coupons/${promoCode}`);
}

function subscribeApi(params) {
  return Api.post('/userApi/user/subscribe', params);
}

function forgotPasswordApi(params) {
  return Api.post('/userApi/forgotpassword', params);
}

function unsubscribeApi() {
  const state = store.getState();
  const {
    auth: {info: {token}, user: {id}},
  } = state;

  return Api.post('/userApi/user/unsubscribe', {id, token});
}

function* setAuthInfo(params) {
  const {token} = params;

  yield put({
    type: AUTH_INFO_SET,
    user: {...params},
    info: {token},
  });
}

function* onError(error) {
  yield put({
    type: ON_MESSAGE,
    message: error,
    messageType: 'error'
  });
  yield put({type: AUTH_UNSET_LOADING});
}

function* registerFlow(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params} = action;
    const res = yield call(signUpApi, params);

    if (!res.success) {
      yield onError(new Error(res.error_messages));
    } else {
      yield setAuthInfo(res);
      yield put({type: AUTH_UNSET_LOADING});
      yield put({
        type: SIGNUP_PAYMENT_STEP,
        isPaymentStep: true,
      });
    }
  } catch (error) {
    yield onError(error);
  }
}

function* loginFlow(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params} = action;
    const res = yield call(signInApi, params);

    if (!res.success) {
      yield onError(new Error(res.error_messages));
    } else {
      yield setAuthInfo(res);
      yield put({type: SET_AUTHENTICATED});
      yield put({type: AUTH_UNSET_LOADING});

      forwardTo('/magic-tutorials');
    }
  } catch (error) {
    yield onError(error);
  }
}

function* couponFlow(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params: {promoCode}} = action;
    const res = yield call(couponApi, promoCode);

    if (res.type) {
      if (res.type.description) {
        yield put({
          type: AUTH_INFO_SET,
          info: {promoCode: res},
        });
        yield put({
          type: ON_MESSAGE,
          message: res.type.description,
          messageType: 'success'
        });
      }
    }
    yield put({type: AUTH_UNSET_LOADING});
  } catch (error) {
    yield onError(new Error('Coupon not valid!'));
  }
}

function* subscribeFlow(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params} = action;
    const res = yield call(subscribeApi, params);

    if (res.status) {
      if (res.link) {
        localStorage.subscriptionInProgress = true;

        yield put({type: SET_AUTHENTICATED});
        yield put({type: AUTH_UNSET_LOADING});

        window.location = res.link;
      } else {
        yield put({type: SET_AUTHENTICATED});
        yield put({type: AUTH_UNSET_LOADING});
        forwardTo('/magic-tutorials');
      }
    } else {
      yield onError(new Error(res.message));
    }
  } catch (error) {
    yield onError(error);
  }
}

function* getCoupon(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params: {coupon}} = action;
    const res = yield call(couponApi, coupon);

    yield put({
      type: AUTH_INFO_SET,
      info: {promoCode: res},
    });

    yield put({type: AUTH_UNSET_LOADING});
  } catch (error) {
    yield onError(new Error('Coupon not valid!'));
  }
}

function* resetPassword(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params} = action;
    const res = yield call(forgotPasswordApi, params);

    if (!res.success) {
      yield onError(new Error(res.error_messages));
    } else {
      forwardTo('/');
      yield put({
        type: ON_MESSAGE,
        message: res.message,
        messageType: 'success',
      });
    }

    yield put({type: AUTH_UNSET_LOADING});
  } catch (error) {
    yield onError(error);
  }
}

function* unsubscribe(action) {
  try {
    yield put({type: AUTH_SET_LOADING});

    const {params} = action;
    const res = yield call(unsubscribeApi, params);

    if (res.status) {
      forwardTo('/account-settings');
      yield put({
        type: ON_MESSAGE,
        message: 'The unsubscribe is successful',
        messageType: 'success',
      });
    }

    yield put({type: AUTH_UNSET_LOADING});
  } catch (error) {
    yield onError(error);
  }
}

export function* registerWatcher() {
  yield takeLatest(SIGNUP_USER, registerFlow);
}

export function* loginWatcher() {
  yield takeLatest(SIGIN_USER, loginFlow);
}

export function* couponWatcher() {
  yield takeLatest(SEND_COUPON, couponFlow);
}

export function* subscribeWatcher() {
  yield takeLatest(ON_SUBSCRIBE, subscribeFlow);
}

export function* getCouponWatcher() {
  yield takeLatest(GET_COUPON, getCoupon);
}

export function* resetPasswordWatcher() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
}

export function* unsubscribeWatcher() {
  yield takeLatest(UNSUBSCRIBE, unsubscribe);
}
