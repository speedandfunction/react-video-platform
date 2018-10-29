/* @flow */

import {push, replace, goBack} from 'connected-react-router';
import {store} from '../store';

export function createReducer(initialState: any, handlers: any) {
  return function reducer(state: any = initialState, action: any) {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

type WrapError = {
  response: {
    status: string,
    data: {
      error: {
        respErrorText: string
      }
    }
  }
};

export function wrapApiErrors(error: WrapError) {
  const {response = {}} = error;
  const {data} = response;

  if (!data) {
    throw new Error('Unknown Api Error');
  }

  const {error: respErrorText} = data;

  throw new Error(respErrorText);
}

export function forwardTo(location: string, needReplace?: boolean = false) {
  const action = needReplace ? replace : push;

  if (location === 'back') {
    return store.dispatch(goBack());
  }

  return store.dispatch(action(location));
}
