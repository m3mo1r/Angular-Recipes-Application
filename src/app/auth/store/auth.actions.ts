import {createAction, props} from "@ngrx/store";

export const LOG_OUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATION_SUCCESS = '[Auth] Login Success';
export const AUTHENTICATION_FAIL = '[Auth] Login Failed';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export const authenticateSuccess = createAction(
  AUTHENTICATION_SUCCESS,
  props<{ payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean
  } }>()
)

export const logout = createAction(
  LOG_OUT
)

export const loginStart = createAction(
  LOGIN_START,
  props<{ payload: { email: string, password: string } }>()
)

export const authenticateFail = createAction(
  AUTHENTICATION_FAIL,
  props<{ payload: string }>()
)

export const signupStart = createAction(
  SIGNUP_START,
  props<{ payload: { email: string, password: string } }>()
)

export const clearError = createAction(
  CLEAR_ERROR
)

export const autoLogin = createAction(
  AUTO_LOGIN
)
