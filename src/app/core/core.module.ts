import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CartModule } from '../cart/cart.module';


@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule,
      GooglePlaceModule,
      CartModule
  ],
  exports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule,
      GooglePlaceModule,
      CartModule
  ],
  providers: []
})
export class CoreModule { }
