import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import { Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";
import {LoggingService} from "../logging.service";
import * as fromApp from "../store/app.reducer";
import * as ShoppingListActions from "./store/shopping-list.actions";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // @ts-ignore
  // ingredients: Ingredient[];
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // @ts-ignore
  // subscription: Subscription;
  constructor( private slService: ShoppingListService,
               private loggingService: LoggingService,
               private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
    this.loggingService.printLog('Hello from the shopping-list.component.ts ngOnInit!');
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(ShoppingListActions.startEdit({ payload: index }));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
