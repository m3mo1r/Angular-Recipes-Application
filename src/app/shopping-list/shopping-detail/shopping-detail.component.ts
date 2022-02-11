import {
  Component, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {ShoppingListService} from "../shopping-list.service";
import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-detail',
  templateUrl: './shopping-detail.component.html',
  styleUrls: ['./shopping-detail.component.css']
})
export class ShoppingDetailComponent implements OnInit, OnDestroy {
  // @ts-ignore
  subscription: Subscription;
  editMode = false;
  // @ts-ignore
  // editedItemIndex: number;
  // @ts-ignore
  editedItem: Ingredient;
  // @ts-ignore
  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(private slService: ShoppingListService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    })
    // this.subscription = this.slService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.slService.getIngredient(index);
    //     this.slForm.setValue({
    //       'name': this.editedItem.name,
    //       'amount': this.editedItem.amount
    //     });
    //   }
    // );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);

    if(this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, ingredient);
      this.store.dispatch(ShoppingListActions.updateIngredient({ payload: ingredient } ));
    } else {
      // this.slService.addIngredient(ingredient);
      this.store.dispatch(ShoppingListActions.addIngredient({payload: ingredient}));
    }

    this.editMode = false;
    form.reset({
      'amount': 1
    });
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset({
      'amount': 1
    });
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  onDestroy() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
