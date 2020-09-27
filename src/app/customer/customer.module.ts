import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { OrderComponent } from './order/order.component';
import { ProfilComponent } from './profil/profil.component';
import {CoreModule} from "@app/core/core.module";
import {NotificationsComponent} from "@app/notifications/notifications.component";
import { NotificationCustomerComponent } from '../notification-customer/notification-customer.component';
import { CommentComponent } from './comment/comment.component';


@NgModule({
  declarations: [CustomerComponent, OrderComponent, ProfilComponent, NotificationCustomerComponent, CommentComponent],
  imports: [
    CoreModule,
    CustomerRoutingModule,
  ],
  exports: [CustomerComponent, OrderComponent, ProfilComponent, CoreModule, NotificationCustomerComponent, CommentComponent]
})
export class CustomerModule { }
