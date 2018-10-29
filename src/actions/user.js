import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  TRACK_VIDEO,
  GET_ACTIVE_PROFILE,
  LIKE_VIDEO,
  DISLIKE_VIDEO,
  PROFILE_UPDATE,
  GET_SUB_PROFILE,
  PROFILE_DELETE,
  ACCOUNT_UPDATE,
  PASSWORD_UPDATE,
  ACCOUNT_DELETE,
} from '../constants/actionTypes';

export function addToWishList(params) {
  return {
    type: ADD_TO_WISHLIST,
    params,
  };
}

export function removeFromWishList(params) {
  return {
    type: REMOVE_FROM_WISHLIST,
    params,
  };
}

export function track(params) {
  return {
    type: TRACK_VIDEO,
    params,
  };
}

export function getActiveProfile() {
  return {
    type: GET_ACTIVE_PROFILE,
  };
}

export function getSubProfile() {
  return {
    type: GET_SUB_PROFILE,
  };
}

export function likeVideo(params) {
  return {
    type: LIKE_VIDEO,
    params,
  };
}

export function disLikeVideo(params) {
  return {
    type: DISLIKE_VIDEO,
    params,
  };
}

export function updateProfile(params) {
  return {
    type: PROFILE_UPDATE,
    params,
  };
}

export function deleteProfile() {
  return {
    type: PROFILE_DELETE,
  };
}

export function accountUpdate(params) {
  return {
    type: ACCOUNT_UPDATE,
    params,
  };
}

export function passwordUpdate(params) {
  return {
    type: PASSWORD_UPDATE,
    params,
  };
}

export function deleteAccount(params) {
  return {
    type: ACCOUNT_DELETE,
    params,
  };
}
