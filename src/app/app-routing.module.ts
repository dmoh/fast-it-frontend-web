import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RestaurantsCityComponent} from "./restaurants-city/restaurants-city.component";
import {LoginPageComponent} from "./login-page/login-page.component";


const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'restaurants-city', component: RestaurantsCityComponent},
    {path: 'login', component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
