import {combineReducers} from 'redux';
import {auth, messages, settings, search, media} from './reducers';

export default combineReducers({
  auth,
  messages,
  settings,
  search,
  media,
});
