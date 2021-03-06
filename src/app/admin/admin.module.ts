import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {MatMenuModule} from "@angular/material/menu";
import { CommerceComponent } from './commerce/commerce.component';
import { UserComponent } from './user/user.component';
import { EditCommerceComponent } from './commerce/edit-commerce/edit-commerce.component';
import {CoreModule} from "@app/core/core.module";
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { AssignDeliverisComponent } from './assign-deliveris/assign-deliveris.component';
import { AssignedDeliveryModalComponent } from './assigned-delivery-modal/assigned-delivery-modal.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { AlertManagerComponent } from './first-page/alert-manager/alert-manager.component';
import { ModalUserComponent } from './modal-user/modal-user.component';


@NgModule({
  declarations: [AdminComponent, CommerceComponent, UserComponent, EditCommerceComponent, DeliveriesComponent, AssignDeliverisComponent, AssignedDeliveryModalComponent, FirstPageComponent, AlertManagerComponent, ModalUserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    MatMenuModule,
  ],
  exports: [AdminComponent, EditCommerceComponent, DeliveriesComponent, AssignDeliverisComponent, AssignedDeliveryModalComponent, FirstPageComponent, AlertManagerComponent, ModalUserComponent]
})
export class AdminModule { }
