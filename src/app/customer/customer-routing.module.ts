import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerComponent} from "@app/customer/customer.component";
import {OrderComponent} from "@app/customer/order/order.component";
import {ProfilComponent} from "@app/customer/profil/profil.component";
import {AuthGuard} from "@app/_helpers/auth.guard";



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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
