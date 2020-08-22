import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantDashboardRoutingModule } from './restaurant-dashboard-routing.module';
import { RestaurantDashboardComponent } from './restaurant-dashboard.component';
import { OrderComponent } from './order/order.component';


@NgModule({
  declarations: [RestaurantDashboardComponent, OrderComponent],
  imports: [
    CommonModule,
    RestaurantDashboardRoutingModule
  ],
  exports: [RestaurantDashboardComponent, OrderComponent]
})
export class RestaurantDashboardModule { }
