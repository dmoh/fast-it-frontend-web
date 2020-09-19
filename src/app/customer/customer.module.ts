import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { OrderComponent } from './order/order.component';
import { ProfilComponent } from './profil/profil.component';
import {CoreModule} from "@app/core/core.module";
import {NotificationsComponent} from "@app/notifications/notifications.component";


@NgModule({
  declarations: [CustomerComponent, OrderComponent, ProfilComponent],
  imports: [
    CoreModule,
    CustomerRoutingModule,
  ],
  exports: [CustomerComponent, OrderComponent, ProfilComponent, CoreModule]
})
export class CustomerModule { }
