import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {of, throwError} from "rxjs";

import * as AuthActions from "./auth.actions";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {User} from "../user.model";
import {AuthService} from "../auth.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number,
                              email: string,
                              userId: string,
                              token: string) => {
  const tokenExpirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, tokenExpirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return AuthActions.authenticateSuccess({ payload: {
      email,
      userId,
      token,
      expirationDate: tokenExpirationDate,
      redirect: true
    }});
};

const handlerError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error.error.message) {
    return of(AuthActions.authenticateFail({ payload: errorMessage }));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
    default:
      errorMessage = 'An unknown error occurred!';
      break;
  }
  return of(AuthActions.authenticateFail({ payload: errorMessage }));
};

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap(authData => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => {
        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
      }),
        catchError(errorRes => {
        return handlerError(errorRes);
      }));
    }))
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateSuccess),
        tap(authSuccessActions => {
          if (authSuccessActions.payload.redirect) {
            this.router.navigate(['/']).then();
          }
        })
      ),
    { dispatch: false }
  );

  authSignup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupStart),
        switchMap(signupActions => {
          return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
            email: signupActions.payload.email,
            password: signupActions.payload.password,
            returnSecureToken: true
          }).pipe(
            tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
            map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
            catchError(errorRes => {
            return handlerError(errorRes);
          }));
        }
      ))
  )

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']).then();
        })),
    { dispatch: false }
  )

  autoLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.autoLogin),
        map(() => {
          const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
          } = JSON.parse(<string>localStorage.getItem('userData'));
          if(!userData) {
            return { type: 'DUMMY' };
          }

          const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
          if (loadedUser.token) {
            const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expiresIn);
            return AuthActions.authenticateSuccess({
              payload: {
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
                redirect: false
              }
            });
          }
          return { type: 'DUMMY' };
        }))
  )

  // @Effect()
  // autoLogin = this.actions$.pipe(
  //   ofType(AuthActions.loginStart),
  //   switchMap((authData: AuthActions.loginStart) => {
  //     return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
  //       email: authData.payload.email,
  //       password: authData.payload.password,
  //       returnSecureToken: true
  //     }).pipe(map(resData => {
  //       const tokenExpirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  //       return of(AuthActions.login({ payload: {
  //         email: resData.email,
  //           userId: resData.localId,
  //           token: resData.idToken,
  //           expirationDate: tokenExpirationDate
  //       }}));
  //     }), catchError(error => {
  //       // ...
  //       return of();
  //     }));
  //   })
  // )

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }
}
