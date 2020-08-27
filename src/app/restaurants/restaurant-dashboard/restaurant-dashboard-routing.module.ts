import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {OrderComponent} from '@app/restaurants/restaurant-dashboard/order/order.component';
import {OverviewComponent} from '@app/restaurants/restaurant-dashboard/overview/overview.component';
import {ProductComponent} from '@app/restaurants/restaurant-dashboard/product/product.component';
import {CommerceComponent} from '@app/restaurants/restaurant-dashboard/commerce/commerce.component';


const routes: Routes = [{
  path: 'infos', component: RestaurantDashboardComponent,
  children: [
    {
      path: 'orders',
      component: OrderComponent,
    },
    {
      path: 'overview',
      component: OverviewComponent,
    },
    {
      path: 'products',
      component: ProductComponent,
    },
    {
      path: 'commerce',
      component: CommerceComponent,
    }
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantDashboardRoutingModule { }
