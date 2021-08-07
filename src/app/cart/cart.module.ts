import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import {CartComponent} from './cart.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
    declarations: [CartComponent, CartDetailComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule
    ],
   exports: [
       CartComponent, CartDetailComponent
   ]
})
export class CartModule { }
