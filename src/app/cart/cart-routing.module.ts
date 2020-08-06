import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CartComponent} from './cart.component';
import {CartDetailComponent} from './cart-detail/cart-detail.component';
import {AuthGuard} from '@app/_helpers/auth.guard';


const routes: Routes = [
    { path: 'cart', component: CartComponent },
    { path: 'cart-detail', component: CartDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
