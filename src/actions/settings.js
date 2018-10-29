import {
  GET_SETTINGS,
  GET_STATIC_PAGES,
  SET_SETTINGS,
  GET_CATEGORIES,
  GET_INTROS,
  GET_MAGICIANS,
  CLEAR_SETTINGS,
} from '../constants/actionTypes';

export function getSettings() {
  return {
    type: GET_SETTINGS,
  };
}

export function getStaticPage() {
  return {
    type: GET_STATIC_PAGES,
  };
}

export function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    settings,
  };
}

export function getCategories() {
  return {
    type: GET_CATEGORIES,
  };
}

export function getIntros() {
  return {
    type: GET_INTROS,
  };
}

export function getMagicians() {
  return {
    type: GET_MAGICIANS,
  };
}

export function clearSettingsMedia() {
  return {
    type: CLEAR_SETTINGS,
  };
}
