import {
  MESSAGES_CLEAR,
  ON_MESSAGE,
} from '../constants/actionTypes';

export function sendMessages(params) {
  return {
    type: ON_MESSAGE,
    ...params,
  };
}

export function clearMessages() {
  return {
    type: MESSAGES_CLEAR,
  };
}
