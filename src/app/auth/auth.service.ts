import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";

import { environment } from "../../environments/environment";
import {User} from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  // @ts-ignore
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }
  // signup(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
  //     email,
  //     password,
  //     returnSecureToken: true
  //   }).pipe(
  //     catchError(errorRes => this.handleError(errorRes)),
  //     tap(resData => this.handleAuthentication(
  //       resData.email,
  //       resData.localId,
  //       resData.idToken,
  //       +resData.expiresIn
  //     ))
  //   );
  // }

  // login(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
  //     email,
  //     password,
  //     returnSecureToken: true
  //   }).pipe(
  //     catchError(errorRes => this.handleError(errorRes)),
  //     tap(resData => this.handleAuthentication(
  //       resData.email,
  //       resData.localId,
  //       resData.idToken,
  //       +resData.expiresIn
  //     ))
  //   );
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string,
  //     id: string,
  //     _token: string,
  //     _tokenExpirationDate: string
  //   } = JSON.parse(<string>localStorage.getItem('userData'));
  //
  //   if(!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
  //   if (loadedUser.token) {
  //     const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
  //     this.autoLogout(expiresIn);
  //     // this.user.next(loadedUser);
  //     this.store.dispatch(AuthActions.authenticateSuccess({ payload: {
  //         email: loadedUser.email,
  //         userId: loadedUser.id,
  //         token: loadedUser.token,
  //         expirationDate: new Date(userData._tokenExpirationDate)}}))
  //   }
  //   return;
  // }

  // logout() {
  //   // @ts-ignore
  //   // this.user.next(null);
  //   this.store.dispatch(AuthActions.logout());
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   localStorage.removeItem('userData');
  //   // this.router.navigate(['/auth']).then();
  // }

  setLogoutTimer(expirationDuration: number) { // autoLogout
    this.tokenExpirationTimer = setTimeout(() => {
      // this.logout();
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  //   const tokenExpirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(email, userId, token, tokenExpirationDate);
  //
  //   // this.user.next(user);
  //   this.store.dispatch(AuthActions.authenticateSuccess({ payload: {
  //     email, userId, token, expirationDate: tokenExpirationDate } }));
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorRes.error.error.message) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'The email address is already in use by another account.';
  //       break;
  //     case 'OPERATION_NOT_ALLOWED':
  //       errorMessage = 'Password sign-in is disabled for this project.';
  //       break;
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //       errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'The password is invalid or the user does not have a password.';
  //       break;
  //     case 'USER_DISABLED':
  //       errorMessage = 'The user account has been disabled by an administrator.';
  //       break;
  //     default:
  //       errorMessage = 'An unknown error occurred!';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }
}
