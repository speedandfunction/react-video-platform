import {createReducer} from '../utils';
import {
  ON_MESSAGE,
  MESSAGES_CLEAR
} from '../constants/actionTypes';

const initialState = {
  message: null,
  messageType: null,
};

const messagesReducer = createReducer(initialState, {
  [ON_MESSAGE]: (state, {message, messageType}) => (
    {
      ...state,
      message,
      messageType,
    }
  ),
  [MESSAGES_CLEAR]: () => (
    {...initialState}
  ),
});

export default messagesReducer;
