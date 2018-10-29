import {
  GET_VIDEOS,
  CLEAR_SEARCH,
} from '../constants/actionTypes';

export function searchVideos(params) {
  return {
    type: GET_VIDEOS,
    params
  };
}

export function clearSearch() {
  return {
    type: CLEAR_SEARCH,
  };
}
