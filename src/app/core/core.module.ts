import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";


@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule,
      GooglePlaceModule,
  ],
  exports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterModule,
      GooglePlaceModule
  ],
  providers: []
})
export class CoreModule { }
