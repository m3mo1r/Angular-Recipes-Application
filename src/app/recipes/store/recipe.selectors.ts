import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as fromRecipes from "./recipe.reducer";
import * as fromApp from "../../store/app.reducer";

export const selectRecipesState = createFeatureSelector<fromRecipes.State>('recipes');

export const selectRecipes = () => createSelector(
  selectRecipesState,
  recipesState => recipesState.recipes
)
