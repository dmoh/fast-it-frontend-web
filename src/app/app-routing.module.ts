import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RestaurantsCityComponent} from './restaurants-city/restaurants-city.component';
import {LoginComponent} from '@app/login/login.component';
import {AuthGuard} from '@app/_helpers/auth.guard';
import {RestaurantDashboardComponent} from '@app/restaurants/restaurant-dashboard/restaurant-dashboard.component';
import {ShowOrderComponent} from '@app/restaurants/show-order/show-order.component';
import {AdminComponent} from '@app/admin/admin.component';
import {PasswordComponent} from '@app/password/password.component';
import {Page404Component} from "@app/page404/page404.component";
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import {LegacyComponent} from "@app/legacy/legacy.component";
import {CategoryViewComponent} from "@app/category-view/category-view.component";
import {SubscriptionComponent} from "@app/subscription/subscription.component";


const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'restaurants-city', component: RestaurantsCityComponent},
    {path: 'login', component: LoginComponent},
    {path: 'password', component: PasswordComponent},
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
    { path: 'legacy', component: LegacyComponent  },
    { path: 'show-order/:orderId/:token', component: ShowOrderComponent },
    { path: 'category', component: CategoryViewComponent },
    { path: 'subscription', component: SubscriptionComponent },
    { path: '404', component: Page404Component },
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
