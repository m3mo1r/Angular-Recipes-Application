import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://angular01082021-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json', recipes).subscribe(
      responseData => console.log(responseData)
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://angular01082021-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json').
    pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      // tap(recipes => this.recipeService.setRecipes(recipes))
      tap(recipes => this.store.dispatch(RecipesActions.setRecipes({ payload: recipes })))
    );
  }
}
