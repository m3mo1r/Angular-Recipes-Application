import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import { Recipe } from "../recipe.model";
import {RecipeService} from "../recipe.service";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from "../store/recipe.actions";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // @ts-ignore
  recipes: Recipe[];
  // @ts-ignore
  subscription: Subscription;
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.subscription = this.recipeService.recipesChanged.subscribe(
    //   (recipes: Recipe[]) => {
    //     this.recipes = recipes;
    //   }
    // );
    this.subscription = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes ))
      .subscribe((recipes: Recipe[]) => this.recipes = recipes );
    // this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route} ).then();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
