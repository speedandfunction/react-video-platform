import {
  GET_TUTORIALS_INTRO,
  CLEAR_TUTORIALS_INTRO,
  GET_CARD_VIDEO,
  CLEAR_CARD_VIDEO,
  GET_MAGICIAN_TUTORIALS,
  SET_CURRENT_INTRO,
  CLEAR_MAGICIAN_VIDEOS,
  GET_MAGICIAN_VIDEOS,
  GET_VIDEO_REVIEWS,
  CREATE_VIDEO_REVIEW,
  GET_PAGE_VIDEO,
  CLEAR_PAGE_VIDEO,
} from '../constants/actionTypes';

export function loadTutorialsIntro(params) {
  return {
    type: GET_TUTORIALS_INTRO,
    params
  };
}

export function clearTutorialsIntro() {
  return {
    type: CLEAR_TUTORIALS_INTRO,
  };
}

export function loadCardVideo(params) {
  return {
    type: GET_CARD_VIDEO,
    params,
  };
}

export function clearCardVideo() {
  return {
    type: CLEAR_CARD_VIDEO,
  };
}

export function loadMagicianTutorials(params) {
  return {
    type: GET_MAGICIAN_TUTORIALS,
    params,
  };
}

export function setCurrentIntro({video}) {
  return {
    type: SET_CURRENT_INTRO,
    video,
  };
}

export function clearMagicianVideos() {
  return {
    type: CLEAR_MAGICIAN_VIDEOS,
  };
}

export function getMagicianVideos(params) {
  return {
    type: GET_MAGICIAN_VIDEOS,
    params,
  };
}

export function getReviews(params) {
  return {
    type: GET_VIDEO_REVIEWS,
    params,
  };
}

export function createReview(params) {
  return {
    type: CREATE_VIDEO_REVIEW,
    params,
  };
}

export function loadPageVideo(params) {
  return {
    type: GET_PAGE_VIDEO,
    params,
  };
}

export function clearPageVideo() {
  return {
    type: CLEAR_PAGE_VIDEO,
  };
}
