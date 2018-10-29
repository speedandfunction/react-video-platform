import {createReducer} from '../utils';
import {
  AUTH_SET_LOADING,
  AUTH_UNSET_LOADING,
  SIGNUP_SUCCESS,
  AUTH_INFO_SET,
  SET_AUTHENTICATED,
  AUTH_RESET,
  SIGNUP_PAYMENT_STEP,
  AUTH_LOGOUT,
  SET_ACTIVE_PROFILE,
} from '../constants/actionTypes';

const initialState = {
  user: null,
  profile: null,
  info: {
    isAuthenticated: false,
    token: null,
    promoCode: null,
  },
  isRegistrationCompleted: false,
  isPaymentStep: false,
  loading: false,
};

const authReducer = createReducer(initialState, {
  [AUTH_LOGOUT]: () => (
    {...initialState}
  ),

  [SET_AUTHENTICATED]: state => (
    {
      ...state,
      info: {...state.info, isAuthenticated: true}
    }
  ),

  [AUTH_SET_LOADING]: state => (
    {...state, loading: true}
  ),

  [AUTH_UNSET_LOADING]: state => (
    {...state, loading: false}
  ),

  [SIGNUP_SUCCESS]: state => (
    {...state, isRegistrationCompleted: true}
  ),

  [AUTH_INFO_SET]: (state, {info, user}) => (
    {
      ...state,
      user: {...state.user, ...user || {}},
      info: {...state.info, ...info || {}}
    }
  ),

  [SIGNUP_PAYMENT_STEP]: (state, {isPaymentStep}) => (
    {...state, isPaymentStep}
  ),

  [AUTH_RESET]: () => (
    {...initialState}
  ),

  [SET_ACTIVE_PROFILE]: (state, {profile}) => (
    {...state, profile}
  ),
});

export default authReducer;
