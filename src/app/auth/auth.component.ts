import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  // @ts-ignore
  error : string = null;
  // @ts-ignore
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  // @ts-ignore
  private closeSub: Subscription;
  // @ts-ignore
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObservable : Observable<AuthResponseData>;
    if (this.isLoginMode) {
      // authObservable = this.authService.login(email, password);
      this.store.dispatch(AuthActions.loginStart({ payload: { email, password } }));
    } else {
      // authObservable = this.authService.signup(email, password);
      this.store.dispatch(AuthActions.signupStart({ payload: { email, password } }));
    }

    // authObservable.subscribe(
    //   responseData => {
    //     console.log(responseData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']).then();
    //   }, errorMessage => {
    //     console.log(errorMessage);
    //     this.isLoading = false;
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //   }
    // )

    form.reset();
  }

  onHandleError() {
    // @ts-ignore
    // this.error = null;
    this.store.dispatch(AuthActions.clearError());
  }

  private showErrorAlert(message: string) {
    const alertCmp = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmp);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
