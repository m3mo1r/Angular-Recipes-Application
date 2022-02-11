import {Action, createAction, props} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";

// export const ADD_INGREDIENT = 'ADD_INGREDIENT'

// export class AddIngredient implements Action {
//   readonly type = ADD_INGREDIENT;
//   constructor(public payload: Ingredient) {}
// }

export const addIngredient = createAction(
  '[ShoppingList] AddIngredient',
  props<{ payload: Ingredient}>()
)

export const addIngredients = createAction(
  '[ShoppingList] AddIngredients',
  props<{ payload: Ingredient[] }>()
)

export const updateIngredient = createAction(
  '[ShoppingList] UpdateIngredient',
  props<{ payload: Ingredient }>()
)

export const deleteIngredient = createAction(
  '[ShoppingList] DeleteIngredient'
)

export const startEdit = createAction(
  '[ShoppingList] StartEdit',
  props<{ payload: number }>()
)

export const stopEdit = createAction(
  '[ShoppingList] StopEdit',
)
