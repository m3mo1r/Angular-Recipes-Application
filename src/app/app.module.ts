import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {StoreModule} from "@ngrx/store"

import {EffectsModule} from "@ngrx/effects";
import {RouterModule} from "@angular/router";
import {AuthEffects} from "./auth/store/auth.effects";
import {AppRoutingModule} from "./app-routing.module";
import {CoreModule} from "./core.module";
import {SharedModule} from "./shared/shared.module";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {NavigationActionTiming, StoreRouterConnectingModule} from "@ngrx/router-store";

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {appReducer} from "./store/app.reducer";
import {environment} from "../environments/environment";
import {RecipeEffects} from "./recipes/store/recipe.effects";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot({ navigationActionTiming: NavigationActionTiming.PostActivation }),
    RouterModule,
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
