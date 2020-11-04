import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {MatMenuModule} from "@angular/material/menu";
import { CommerceComponent } from './commerce/commerce.component';
import { UserComponent } from './user/user.component';
import { EditCommerceComponent } from './commerce/edit-commerce/edit-commerce.component';
import {CoreModule} from "@app/core/core.module";


@NgModule({
  declarations: [AdminComponent, CommerceComponent, UserComponent, EditCommerceComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    MatMenuModule,
  ],
  exports: [AdminComponent, EditCommerceComponent]
})
export class AdminModule { }
