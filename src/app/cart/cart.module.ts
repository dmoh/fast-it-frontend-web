import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import {CartComponent} from './cart.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';


@NgModule({
  declarations: [CartComponent, CartDetailComponent],
  imports: [
    CommonModule,
    CartRoutingModule
  ],
   exports: [
       CartComponent, CartDetailComponent
   ]
})
export class CartModule { }
