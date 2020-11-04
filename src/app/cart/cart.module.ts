import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import {CartComponent} from './cart.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [CartComponent, CartDetailComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        MatButtonModule
    ],
   exports: [
       CartComponent, CartDetailComponent
   ]
})
export class CartModule { }
