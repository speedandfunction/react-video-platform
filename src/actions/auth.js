import {
  SIGIN_USER,
  SIGNUP_USER,
  AUTH_LOGOUT,
  SEND_COUPON,
  AUTH_RESET,
  SIGNUP_PAYMENT_STEP,
  ON_SUBSCRIBE,
  GET_COUPON,
  RESET_PASSWORD,
  UNSUBSCRIBE,
} from '../constants/actionTypes';

export function logout() {
  return {
    type: AUTH_LOGOUT,
  };
}

export function login(params) {
  return {
    type: SIGIN_USER,
    params,
  };
}

export function sendCoupon(params) {
  return {
    type: SEND_COUPON,
    params,
  };
}

export function signUp(params) {
  return {
    type: SIGNUP_USER,
    params,
  };
}

export function resetAuth() {
  return {
    type: AUTH_RESET,
  };
}

export function setPaymentState({isPaymentStep}) {
  return {
    type: SIGNUP_PAYMENT_STEP,
    isPaymentStep,
  };
}

export function subscribe(params) {
  return {
    type: ON_SUBSCRIBE,
    params,
  };
}

export function getCoupon(params) {
  return {
    type: GET_COUPON,
    params,
  };
}

export function resetPassword(params) {
  return {
    type: RESET_PASSWORD,
    params,
  };
}

export function unsubscribe() {
  return {
    type: UNSUBSCRIBE,
  };
}
