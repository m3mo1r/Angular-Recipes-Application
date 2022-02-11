import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map, switchMap} from "rxjs/operators";
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from "../store/recipe.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  // @ts-ignore
  recipe: Recipe;
  // @ts-ignore
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];
    //     console.log(this.id);
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // );
    this.route.params
      .pipe(
        map((params: Params) => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe(recipe => {
        if (recipe) {
          this.recipe = recipe;
        }
      })
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(ShoppingListActions.addIngredients({ payload: this.recipe.ingredients }));
  }

  onEditRecipe() {
    console.log(this.route);
    this.router.navigate(['edit'], { relativeTo: this.route} ).then();
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(RecipesActions.deleteRecipe({ payload: this.id }));
    this.router.navigate(['../'], {relativeTo: this.route}).then();
  }

}
