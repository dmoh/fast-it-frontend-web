import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AwaitingDeliveryComponent } from './awaiting-delivery/awaiting-delivery.component';
import { DeliveryComponent } from './delivery.component';
import { DetailDeliveryComponent } from './detail-delivery/detail-delivery.component';
import { MyDeliveryComponent } from './my-delivery/my-delivery.component';
import { ParameterComponent } from './parameter/parameter.component';


const routes: Routes = [{
  path: 'delivery', component: DeliveryComponent,
  children: [
    {
      path: 'awaiting-delivery',
      component: AwaitingDeliveryComponent,
    },
    {
      path: 'detail-delivery/:id',
      component: DetailDeliveryComponent,
    },
    {
      path: 'my-delivery',
      component: MyDeliveryComponent,
    },
    {
      path: 'parameter',
      component: ParameterComponent,
    },
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule { }
