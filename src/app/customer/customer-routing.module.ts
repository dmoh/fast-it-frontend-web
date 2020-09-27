import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerComponent} from "@app/customer/customer.component";
import {OrderComponent} from "@app/customer/order/order.component";
import {ProfilComponent} from "@app/customer/profil/profil.component";
import {AuthGuard} from "@app/_helpers/auth.guard";
import {NotificationCustomerComponent} from "@app/notification-customer/notification-customer.component";
import {CommentComponent} from "@app/customer/comment/comment.component";



const routes: Routes = [
  {
    path: 'customer', component: CustomerComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'profil',
        component: ProfilComponent,
      },
      {
        path: 'notification',
        component: NotificationCustomerComponent,
      },
      {
        path: 'comment',
        component: CommentComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
