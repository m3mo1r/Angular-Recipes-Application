import {NgModule} from "@angular/core";

import {ShoppingDetailComponent} from "./shopping-detail/shopping-detail.component";
import {ShoppingListComponent} from "./shopping-list.component";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    ShoppingDetailComponent,
    ShoppingListComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent }
    ]),
    FormsModule,
    SharedModule
  ]
})
export class ShoppingListModule {

}
