import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RestaurantsCityComponent} from './restaurants-city/restaurants-city.component';
import {LoginComponent} from '@app/login/login.component';
import {AuthGuard} from '@app/_helpers/auth.guard';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import { DeliveryComponent } from './delivery/delivery.component';
import {ShowOrderComponent} from "@app/restaurants/show-order/show-order.component";
import {AdminComponent} from "@app/admin/admin.component";


const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'restaurants-city', component: RestaurantsCityComponent},
    {path: 'login', component: LoginComponent},
    {path: 'delivery', component: DeliveryComponent},
    { path: 'restaurant-dashboard/:id', component: RestaurantDashboardComponent, canActivate: [AuthGuard]  },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
    { path: 'show-order', component: ShowOrderComponent }//
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
