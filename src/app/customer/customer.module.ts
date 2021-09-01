import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { OrderComponent } from './order/order.component';
import { ProfilComponent } from './profil/profil.component';
import {CoreModule} from '@app/core/core.module';
import { NotificationCustomerComponent } from '../notification-customer/notification-customer.component';
import { CommentComponent } from './comment/comment.component';
import { OrderModalComponent } from './order/order-modal/order-modal.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [CustomerComponent, OrderComponent, ProfilComponent, NotificationCustomerComponent, CommentComponent, OrderModalComponent, OverviewComponent],
    imports: [
      CoreModule,
      CustomerRoutingModule,
    ],
  exports: [
    CustomerComponent,
    OrderComponent,
    ProfilComponent,
    CoreModule,
    NotificationCustomerComponent,
    CommentComponent,
    OrderModalComponent,
    OverviewComponent
  ]
})
export class CustomerModule { }
