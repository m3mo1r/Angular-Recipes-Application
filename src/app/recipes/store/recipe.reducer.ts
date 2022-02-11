import {Action, createReducer, on} from "@ngrx/store";
import {Recipe} from "../recipe.model";
import * as RecipeActions from "./recipe.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

const updatedRecipes = (state: State, index: number, newRecipe: Recipe) => {
  const updatedRecipe = {
    ...state.recipes[index],
    ...newRecipe
  };
  const updatedRecipes = [ ...state.recipes ];
  updatedRecipes[index] = updatedRecipe;
  return updatedRecipes;
}

const reducer = createReducer(
  initialState,
  on(RecipeActions.setRecipes, (state, { payload }) => ({
    ...state,
    recipes: [ ...payload ]
  })),
  on(RecipeActions.addRecipe, (state, { payload }) => ({
    ...state,
    recipes: [ ...state.recipes, payload ]
  })),
  on(RecipeActions.updateRecipe, (state, { payload }) => ({
    ...state,
    recipes: updatedRecipes(state, payload.index, payload.newRecipe)
  })),
  on(RecipeActions.deleteRecipe, (state, { payload }) => ({
    ...state,
    recipes: state.recipes.filter((recipe, index) => {
      return payload !== index;
    })
  }))
)

export function recipeReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
