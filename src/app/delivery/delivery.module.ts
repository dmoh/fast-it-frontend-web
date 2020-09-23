import { NgModule } from '@angular/core';
import { DeliveryRoutingModule } from './delivery-routing.module';
import {CoreModule} from "../core/core.module";
import { ParameterComponent } from './parameter/parameter.component';
import { DeliveryComponent } from './delivery.component';
import { MyDeliveryComponent } from './my-delivery/my-delivery.component';
import { AwaitingDeliveryComponent } from './awaiting-delivery/awaiting-delivery.component';


@NgModule({
  declarations: [
      ParameterComponent,
      DeliveryComponent,
      CoreModule,
      MyDeliveryComponent,
      AwaitingDeliveryComponent
  ],
  imports: [
    CoreModule,
    DeliveryRoutingModule
  ],
  exports: [
      CoreModule,
      DeliveryComponent,
      MyDeliveryComponent,
      AwaitingDeliveryComponent,
      ParameterComponent
  ]
})
export class DeliveryModule { }
