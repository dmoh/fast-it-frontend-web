import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerComponent} from "@app/customer/customer.component";
import {AuthGuard} from "@app/_helpers/auth.guard";
import {OrderComponent} from "@app/customer/order/order.component";
import {ProfilComponent} from "@app/customer/profil/profil.component";
import {NotificationCustomerComponent} from "@app/notification-customer/notification-customer.component";
import {CommentComponent} from "@app/customer/comment/comment.component";
import {AdminComponent} from "@app/admin/admin.component";
import {CommerceComponent} from "@app/admin/commerce/commerce.component";
import {UserComponent} from "@app/admin/user/user.component";
import {DeliveriesComponent} from "@app/admin/deliveries/deliveries.component";
import {CategoryComponent} from "@app/admin/category/category.component";
import {SectorComponent} from "@app/admin/sector/sector.component";
import {OrderManagerComponent} from "@app/admin/order-manager/order-manager.component";
import {PromotionComponent} from "@app/admin/promotion/promotion.component";
import {TrackingComponent} from "@app/admin/tracking/tracking.component";


const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'commerce',
        component: CommerceComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'deliveries',
        component: DeliveriesComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'sector',
        component: SectorComponent,
      },
      {
        path: 'order-manager',
        component: OrderManagerComponent,
      },
      {
        path: 'promotion',
        component: PromotionComponent,
      },
      {
        path: 'tracking',
        component: TrackingComponent,
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
