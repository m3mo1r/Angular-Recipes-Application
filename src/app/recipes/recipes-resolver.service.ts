import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {select, Store} from "@ngrx/store";

import {Recipe} from "./recipe.model";
import {DataStorageService} from "../shared/data-storage.service";
import {RecipeService} from "./recipe.service";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "./store/recipe.actions";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {filter, first, map, switchMap, take, tap} from "rxjs/operators";
import {selectRecipes} from "./store/recipe.selectors";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private dataStorageService: DataStorageService,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    // Observable<Recipe[]> | Promise<Recipe[]> | Recipe[]
    // const recipes = this.recipeService.getRecipes();
    // if (recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // }
    // return recipes;

    // this.store.select('recipes').pipe(take(1), map(recipesState => recipesState.recipes), switchMap((recipes: Recipe[]) => {
    //   if (recipes.length === 0) {
    //     this.store.dispatch(RecipesActions.fetchRecipes());
    //     return createEffect(
    //       () =>
    //         this.actions$.pipe(ofType(RecipesActions.setRecipes), take(1)),
    //       { dispatch: false }
    //     )
    //   } else {
    //     return of(recipes);
    //   }
    // }))

    return this.store.select('recipes').pipe(
      map(recipesState => recipesState.recipes),
      tap((recipes: Recipe[]) => {
        if (recipes.length === 0) {
          this.store.dispatch(RecipesActions.fetchRecipes());
          createEffect(() => this.actions$.pipe(ofType(RecipesActions.setRecipes), take(1)), { dispatch: false });
        } else {
          of(recipes);
        }
      }),
      filter(recipes => !!recipes),
      first()
    )
  }
}
