import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {HttpClient} from "@angular/common/http";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import * as RecipesActions from "./recipe.actions";
import {Recipe} from "../recipe.model";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.fetchRecipes),
        switchMap(fetchActions => {
          return this.http.get<Recipe[]>('https://angular01082021-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json');
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        map(recipes => RecipesActions.setRecipes({ payload: recipes }))
      )
  )

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([storeActions, recipesState]) => {
          return this.http.put('https://angular01082021-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json', recipesState.recipes);
        })
      ),
    { dispatch: false }
  )

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
}
