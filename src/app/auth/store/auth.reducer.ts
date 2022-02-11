import {Action, createReducer, on} from "@ngrx/store";

import {User} from "../user.model";
import * as authActions from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  //@ts-ignore
  user: null,
  // @ts-ignore
  authError: null,
  loading: false
}

const reducer = createReducer(
  initialState,
  on(authActions.authenticateSuccess, (state, { payload }) => ({
    ...state,
    user: new User(payload.email, payload.userId, payload.token, payload.expirationDate),
    // @ts-ignore
    authError: null,
    loading: false
  })),
  on(authActions.logout, state => ({
    ...state,
    // @ts-ignore
    user: null
  })),
  on(authActions.loginStart, authActions.signupStart, state => ({
    ...state,
    // @ts-ignore
    authError: null,
    loading: true
  })),
  on(authActions.authenticateFail, (state, { payload }) => ({
    ...state,
    // @ts-ignore
    user: null,
    authError: payload,
    loading: false
  })),
  on(authActions.clearError, state => ({
    ...state,
    // @ts-ignore
    authError: null
  }))
)

export function authReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
