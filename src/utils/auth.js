import {store} from '../store';

export function checkAuth() {
  const {auth: {user}} = store.getState();

  if (!user) {
    return false;
  }

  const {user_id, access_token, expire} = user;
  const currentTime = new Date().getTime();

  return (user_id !== '' && user_id !== undefined)
    && (access_token !== undefined && access_token !== '')
    && (expire > currentTime);
}

export function checkAuthAndPay() {
  const {
    auth: {
      user: {
        user_id, access_token, expire, payment_is_not_completed,
      },
    },
  } = store.getState();
  const currentTime = new Date().getTime();

  return (user_id !== '' && user_id !== undefined)
    && (access_token !== undefined && access_token !== '')
    && (expire > currentTime)
    && !payment_is_not_completed;
}
