import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";
import * as fromApp from "../store/app.reducer";
import {map} from "rxjs/operators";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  // @ts-ignore
  private userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.userSubscription = this.authService.user.subscribe(user => {
    this.userSubscription = this.store.select('auth').
    pipe(map(authState => authState.user)).
    subscribe(user => {
      this.isAuthenticated = !!user;
    });
    console.log(this.isAuthenticated);
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(RecipesActions.storeRecipes());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(RecipesActions.fetchRecipes());
  }

  onLogout() {
    this.isAuthenticated = false;
    // this.authService.logout();
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
