import { NgModule } from '@angular/core';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import {NavbarComponent} from "../navbar/navbar.component";
import {ProductModalComponent} from "../product-modal/product-modal.component";
import {CoreModule} from "../core/core.module";
import {CartComponent} from "../cart/cart.component";
import { OrderModalComponent } from './order-modal/order-modal.component';
import { ShowOrderComponent } from './show-order/show-order.component';
import {InfoModalComponent} from "@app/info-modal/info-modal.component";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
      RestaurantDetailsComponent,
      OrderModalComponent,
      ShowOrderComponent,
  ],
    imports: [
        CoreModule,
        RestaurantsRoutingModule,
        NgbDropdownModule
    ],
  entryComponents: [
      NavbarComponent,
      ProductModalComponent,
      CartComponent,
      InfoModalComponent
  ],
  exports: [
      CoreModule,
      OrderModalComponent,
      ShowOrderComponent
  ]
})
export class RestaurantsModule { }
