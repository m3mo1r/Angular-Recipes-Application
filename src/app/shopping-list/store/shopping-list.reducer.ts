import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import {Action, createReducer, on} from "@ngrx/store";

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState : State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Bananas', 15),
  ],
  // @ts-ignore
  editedIngredient: null,
  editedIngredientIndex: -1
};

const updatedIngredients = (state: State, ig: Ingredient) => {
  const ingredients = [ ...state.ingredients ];
  // const ingredient = state[igIndex];
  // const updatedIngredient = {
  //   ...ingredient,
  //   ...ig
  // };
  // const updatedIngredients = state;
  // updatedIngredients[igIndex] = updatedIngredient;
  // return updatedIngredients;
  ingredients[state.editedIngredientIndex] = ig;
  return ingredients;
}

const reducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, { payload }) => ({
    ...state,
    ingredients: [...state.ingredients, payload]})),
  on(ShoppingListActions.addIngredients, (state, { payload }) => ({
    ...state,
    ingredients: [...state.ingredients, ...payload]
  })),
  on(ShoppingListActions.updateIngredient, (state, { payload }) => ({
    ...state,
    ingredients: updatedIngredients(state, payload),
    // @ts-ignore
    editedIngredient: null,
    editedIngredientIndex: -1
  })),
  on(ShoppingListActions.deleteIngredient, state => ({
    ...state,
    ingredients: state.ingredients.filter((ig, igIndex) => {
      return igIndex !== state.editedIngredientIndex;
    }),
    // @ts-ignore
    editedIngredient: null,
    editedIngredientIndex: -1
  })),
  on(ShoppingListActions.startEdit, (state, { payload }) => ({
    ...state,
    editedIngredientIndex: payload,
    editedIngredient: { ...state.ingredients[payload] }
  })),
  on(ShoppingListActions.stopEdit, state => ({
    ...state,
    editedIngredientIndex: -1,
    //@ts-ignore
    editedIngredient: null
  }))
);

export function shoppingListReducer (state: State | undefined, action: Action) {
  return reducer(state, action);
}

// export function shoppingListReducer (state = initState,
//                                      action: ShoppingListActions.AddIngredient) {
//   switch (action.type) {
//     case ShoppingListActions.ADD_INGREDIENT:
//       return {
//         ...state,
//         ingredients: [...state.ingredients]
//       };
//     default:
//       return state;
//   }
// }
