import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import {NavbarComponent} from "../navbar/navbar.component";
import {ProductModalComponent} from "../product-modal/product-modal.component";


@NgModule({
  declarations: [RestaurantDetailsComponent],
  imports: [
    CommonModule,
    RestaurantsRoutingModule
  ],
  entryComponents: [
      NavbarComponent,
      ProductModalComponent
  ]
})
export class RestaurantsModule { }
