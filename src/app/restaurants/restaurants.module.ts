import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import {NavbarComponent} from "../navbar/navbar.component";


@NgModule({
  declarations: [RestaurantDetailsComponent],
  imports: [
    CommonModule,
    RestaurantsRoutingModule
  ],
  entryComponents: [
      NavbarComponent
  ]
})
export class RestaurantsModule { }
