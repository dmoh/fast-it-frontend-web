import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {OrderComponent} from '@app/restaurants/restaurant-dashboard/order/order.component';


const routes: Routes = [{
  path: '', component: RestaurantDashboardComponent,
  children: [
    {
      path: 'orders',
      component: OrderComponent,
    }
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantDashboardRoutingModule { }
